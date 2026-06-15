# from deprecated import deprecated
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException, WebDriverException
from selenium.webdriver.remote.webelement import WebElement
import json
import re
import time
import logging
import os
from typing import List, Dict
from difflib import SequenceMatcher
import bisect
import requests

IS_DELTA = True
DELTA_BACKLOG_COUNT = 5

# Event name patterns that belong to the "After a Race" section.
AFTER_RACE_EVENT_PATTERNS = [
    "Victory! (G1)",
    "Victory! (G2/G3)",
    "Victory! (Pre/OP)",
    "Solid Showing (G1)",
    "Solid Showing (G2/G3)",
    "Solid Showing (Pre/OP)",
    "Defeat (G1)",
    "Defeat (G2/G3)",
    "Defeat (Pre/OP)",
    "Etsuko's Elated Coverage (G1)",
    "Etsuko's Elated Coverage (G2/G3)",
    "Etsuko's Elated Coverage (Pre/OP)",
    "Etsuko's Exhaustive Coverage (G1)",
    "Etsuko's Exhaustive Coverage (G2/G3)",
    "Etsuko's Exhaustive Coverage (Pre/OP)",
]


def load_after_race_events() -> Dict[str, List[str]]:
    """Load "After a Race" events from characters.json.

    These events are identical across all characters, so we only need to read
    them from the first character's data.

    Returns:
        A dictionary of event names to their options.
    """
    after_race_events: Dict[str, List[str]] = {}

    characters_file = os.path.join(os.path.dirname(__file__), "characters.json")
    if not os.path.exists(characters_file):
        logging.warning("characters.json not found. Cannot load \"After a Race\" events.")
        return after_race_events

    try:
        with open(characters_file, "r", encoding="utf-8") as f:
            characters_data = json.load(f)

        # Get the first character's data only.
        if not characters_data:
            logging.warning("characters.json is empty. Cannot load \"After a Race\" events.")
            return after_race_events

        first_character_events = next(iter(characters_data.values()))

        # Extract only events that match the "After a Race" patterns.
        for event_name, options in first_character_events.items():
            for pattern in AFTER_RACE_EVENT_PATTERNS:
                if event_name.startswith(pattern):
                    after_race_events[event_name] = options
                    break

        logging.info(f"Loaded {len(after_race_events)} \"After a Race\" events from characters.json.")

    except (json.JSONDecodeError, KeyError) as e:
        logging.warning(f"Failed to load \"After a Race\" events from characters.json: {e}")

    return after_race_events


def create_chromedriver():
    """Creates the Chrome driver for scraping.

    Returns:
        The Chrome driver.
    """
    driver = uc.Chrome(headless=True, use_subprocess=True)
    return driver


def calculate_turn_number(date_string: str) -> int:
    """Calculates the turn number for a race based on its date string.

    This function parses race date strings in the format "Senior Class January, Second Half"
    and converts them to turn numbers using the same logic as the Kotlin GameDate.

    Args:
        date_string: The date string to parse (e.g., "Senior Class January, Second Half").

    Returns:
        The calculated turn number for the race.
    """
    if not date_string or date_string.strip() == "":
        logging.warning("Received empty date string, defaulting to Senior Year Early Jan (turn 49).")
        return 49

    # Handle Pre-Debut dates (though they shouldn't appear in race data).
    if "debut" in date_string.lower():
        logging.warning("Pre-Debut date detected in race data, this shouldn't happen.")
        return 1

    # Define mappings for years and months.
    years = {"Junior Class": 1, "Classic Class": 2, "Senior Class": 3}

    months = {
        "January": 1,
        "Jan": 1,
        "February": 2,
        "Feb": 2,
        "March": 3,
        "Mar": 3,
        "April": 4,
        "Apr": 4,
        "May": 5,
        "June": 6,
        "Jun": 6,
        "July": 7,
        "Jul": 7,
        "August": 8,
        "Aug": 8,
        "September": 9,
        "Sep": 9,
        "October": 10,
        "Oct": 10,
        "November": 11,
        "Nov": 11,
        "December": 12,
        "Dec": 12,
    }

    # Parse the date string.
    # Expected format: "Senior Class January, Second Half"
    parts = date_string.strip().split()
    if len(parts) < 3:
        logging.warning(f"Invalid date string format: {date_string}, defaulting to Senior Year Early Jan (turn 49).")
        return 49

    # Extract year part (first two words).
    year_part = f"{parts[0]} {parts[1]}"
    month_part = parts[2].rstrip(",")  # Remove trailing comma if present.

    # Extract phase part (last two words combined).
    phase_part = f"{parts[-2]} {parts[-1]}"  # "First Half" or "Second Half"

    # Find the best match for year using similarity scoring.
    year = years.get(year_part)
    if year is None:
        best_year_score = 0.0
        best_year = 3  # Default to Senior Year.

        for year_key in years.keys():
            score = SequenceMatcher(None, year_part, year_key).ratio()
            if score > best_year_score:
                best_year_score = score
                best_year = years[year_key]

        logging.info(f"Year not found in mapping, using best match: {year_part} -> {best_year}")
        year = best_year

    # Find the best match for month using similarity scoring.
    month = months.get(month_part)
    if month is None:
        best_month_score = 0.0
        best_month = 1  # Default to January.

        for month_key in months.keys():
            score = SequenceMatcher(None, month_part, month_key).ratio()
            if score > best_month_score:
                best_month_score = score
                best_month = months[month_key]

        logging.info(f"Month not found in mapping, using best match: {month_part} -> {best_month}")
        month = best_month

    # Determine phase (Early = First Half, Late = Second Half).
    phase = "Early" if "First" in phase_part else "Late"

    # Calculate the turn number.
    # Each year has 24 turns (12 months x 2 phases each).
    # Each month has 2 turns (Early and Late).
    turn_number = ((year - 1) * 24) + ((month - 1) * 2) + (1 if phase == "Early" else 2)

    return turn_number


class BaseScraper:
    """Base class for scraping data from the website.

    Args:
        url (str): The URL to scrape.
        output_filename (str): The filename to save the scraped data to.
    """

    def __init__(self, url: str, output_filename: str):
        self.url = url
        self.output_filename = output_filename
        self.data = self.load_existing_data()
        self.initial_data_count = len(self.data) if IS_DELTA else 0
        self.cookie_accepted = False

    def safe_click(self, driver: uc.Chrome, element: WebElement, retries: int = 3, delay: float = 0.5):
        """Try clicking an element normally and falls back to JS click if blocked by ads/overlays.

        Args:
            driver (uc.Chrome): The Chrome driver.
            element (WebElement): The web element to interact with.
            retries (int, optional): How many times to retry if intercepted.
            delay (float, optional): Seconds to wait between retries
        """
        for _ in range(retries):
            try:
                element.click()
                return True
            except ElementClickInterceptedException:
                # Fallback to scrolling + JS click.
                try:
                    driver.execute_script("arguments[0].scrollIntoView(true);", element)
                    driver.execute_script("arguments[0].click();", element)
                    return True
                except WebDriverException as _:
                    # If JS click fails, wait a bit and retry.
                    time.sleep(delay)
        return False

    def load_existing_data(self):
        """Loads existing JSON data from the output file if delta scraping is enabled.

        Returns:
            The loaded data dictionary, or an empty dictionary if the file doesn't exist or delta scraping is disabled.
        """
        if not IS_DELTA:
            return {}

        if not os.path.exists(self.output_filename):
            logging.info(f"Output file {self.output_filename} does not exist. Starting with empty data.")
            return {}

        try:
            with open(self.output_filename, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
                logging.info(f"Loaded {len(existing_data)} existing items from {self.output_filename} for delta merge.")
                return existing_data
        except json.JSONDecodeError as e:
            logging.warning(f"Failed to parse existing JSON file {self.output_filename}: {e}. Starting with empty data.")
            return {}
        except Exception as e:
            logging.warning(f"Failed to load existing data from {self.output_filename}: {e}. Starting with empty data.")
            return {}

    def save_data(self):
        """Saves the scraped data to a file."""
        # Sort keys alphabetically to maintain consistent ordering.
        from datetime import datetime
        # Newest → oldest
        self.data = dict(
            sorted(
                self.data.items(),
                key=lambda kv: datetime.strptime(kv[1].get("implemented", "2000-01-01"), "%Y-%m-%d"),
                reverse=True                     # <‑‑ flip the order
            )
        )

        with open(self.output_filename, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=4)

        if IS_DELTA and self.initial_data_count > 0:
            new_or_updated = len(self.data) - self.initial_data_count
            logging.info(
                f"Saved {len(self.data)} items to {self.output_filename} (delta merge: {self.initial_data_count} existing + {new_or_updated} new/updated)."
            )
        else:
            logging.info(f"Saved {len(self.data)} items to {self.output_filename}.")

    def handle_cookie_consent(self, driver: uc.Chrome):
        """Handles the cookie consent.

        Args:
            driver (uc.Chrome): The Chrome driver.
        """
        if not self.cookie_accepted:
            try:
                cookie_consent_button = driver.find_element(By.XPATH, "//button[contains(@class, 'legal_cookie_banner_button')]")
                if cookie_consent_button:
                    cookie_consent_button.click()
                    time.sleep(0.5)
                    self.cookie_accepted = True
                    logging.info("Cookie consent accepted.")
            except NoSuchElementException:
                logging.info("No cookie consent button found.")
                self.cookie_accepted = True

    def handle_ad_banner(self, driver: uc.Chrome, skip=False):
        if not skip:
            try:
                ad_banner_button = driver.find_element(By.XPATH, "//div[contains(@class, 'publift-widget-sticky_footer-button')]")
                if ad_banner_button and ad_banner_button.is_displayed():
                    ad_banner_button.click()
                    time.sleep(0.5)
                    logging.info("Ad banner dismissed.")
                    return True
            except NoSuchElementException:
                logging.info("No ad banner found.")
            return False
        else:
            return True

    def extract_training_event_options(self, tooltip_rows: List[WebElement]):
        """Extracts the training event options from the tooltip rows.

        Args:
            tooltip_rows (List[WebElement]): The tooltip rows.

        Returns:
            The training event options.
        """
        options = []
        for tooltip_row in tooltip_rows:
            event_option_div = tooltip_row.find_element(By.XPATH, ".//div[contains(@class, 'sc-') and contains(@class, '-2 ')]")
            event_result_divs = event_option_div.find_elements(By.XPATH, ".//div[not(descendant::div) and normalize-space()]")
            text_fragments = [div.text.strip() for div in event_result_divs]

            # Handle events where it offers random outcomes.
            if text_fragments and text_fragments[0] == "Randomly either":
                option_text = "Randomly either "

                groups = []
                current_group = []

                for frag in text_fragments[1:]:
                    if frag == "or":
                        groups.append(current_group)
                        current_group = []
                    else:
                        current_group.append(frag)

                if current_group:
                    groups.append(current_group)

                option_text += " or ".join([", ".join(g) for g in groups])

            else:
                option_text = ", ".join(text_fragments)

            option_text = option_text.replace("Wisdom", "Wit")
            options.append(option_text)
        return options

    def process_training_events(self, driver: uc.Chrome, item_name: str, data_dict: Dict[str, List[str]], include_after_race_events: bool = False):
        """Processes the training events for the given item.

        Args:
            driver (uc.Chrome): The Chrome driver.
            item_name (str): The name of the item.
            data_dict (Dict[str, List[str]]): The data dictionary to modify.
            include_after_race_events (bool): Whether to include 'After a Race' events (only for characters).
        """
        # Find all training events first.
        all_training_events_unfiltered = driver.find_elements(By.XPATH, "//button[contains(@class, 'sc-') and contains(@class, '-0 ')]")
        logging.info(f"Found {len(all_training_events_unfiltered)} unfiltered training events for {item_name}.")

        # Find the "Events Without Choices" section header and exclude events from its following grid.
        # The section header is a div with class 'sc-*-0' containing the text "Events Without Choices".
        # The grid following it (sc-*-2) contains training events we want to exclude.
        events_to_exclude = set()
        try:
            # Find the div containing "Events Without Choices" text.
            no_choices_header = driver.find_element(
                By.XPATH,
                "//div[contains(@class, 'sc-') and contains(@class, '-0 ') and contains(text(), 'Events Without Choices')]"
            )
            # Find the next sibling div which should be the grid containing events without choices.
            no_choices_grid = no_choices_header.find_element(By.XPATH, "./following-sibling::div[contains(@class, 'sc-') and contains(@class, '-2 ')][1]")
            # Get all training event buttons within this grid.
            events_without_choices = no_choices_grid.find_elements(By.XPATH, ".//button[contains(@class, 'sc-') and contains(@class, '-0 ')]")
            events_to_exclude = set(events_without_choices)
            logging.info(f"Found {len(events_to_exclude)} events without choices to exclude for {item_name}.")
        except NoSuchElementException:
            logging.info(f"No \"Events Without Choices\" section found for {item_name}. Including all events.")

        # Filter out the events without choices.
        all_training_events = [event for event in all_training_events_unfiltered if event not in events_to_exclude]
        logging.info(f"Found {len(all_training_events)} training events (after filtering) for {item_name}.")

        # Find the "After a Race" section and exclude its events from scraping.
        # These events are identical across all characters, so we copy them from characters.json.
        if include_after_race_events:
            after_race_events = set()
            try:
                after_race_header = driver.find_element(
                    By.XPATH,
                    "//div[contains(@class, 'sc-') and contains(@class, '-0 ') and contains(text(), 'After a Race')]"
                )
                after_race_grid = after_race_header.find_element(By.XPATH, "./following-sibling::div[contains(@class, 'sc-') and contains(@class, '-2 ')][1]")
                after_race_buttons = after_race_grid.find_elements(By.XPATH, ".//button[contains(@class, 'sc-') and contains(@class, '-0 ')]")
                after_race_events = set(after_race_buttons)
                logging.info(f"Found {len(after_race_events)} \"After a Race\" events to copy for {item_name}.")
            except NoSuchElementException:
                logging.info(f"No \"After a Race\" section found for {item_name}.")

            # Filter out the "After a Race" events from the list to scrape.
            all_training_events = [event for event in all_training_events if event not in after_race_events]
            logging.info(f"Found {len(all_training_events)} training events (after excluding \"After a Race\") for {item_name}.")

            # Copy the "After a Race" events from the preloaded cache.
            data_dict.update(self.after_race_events)
            logging.info(f"Copied {len(self.after_race_events)} \"After a Race\" events for {item_name}.")

        ad_banner_closed = False

        events_ignore = [
            "Failed training (Get Well Soon!)",
            "Failed training (Don't Overdo It!)",
            "Extra Training",
            "Acupuncture (Just an Acupuncturist, No Worries! ☆)",
            "Victory! (G1)\n1st",
            "Victory! (G2/G3)\n1st",
            "Victory! (Pre/OP)\n1st",
            "Solid Showing (G1)\n2nd-5th",
            "Solid Showing (G2/G3)\n2nd-5th",
            "Solid Showing (Pre/OP)\n2nd-5th",
            "Defeat (G1)\n6th or worse",
            "Defeat (G2/G3)\n6th or worse",
            "Defeat (Pre/OP)\n6th or worse",
            "Etsuko's Elated Coverage (G1)",
            "Etsuko's Elated Coverage (G2/G3)",
            "Etsuko's Elated Coverage (Pre/OP)",
            "Etsuko's Exhaustive Coverage (G1)",
            "Etsuko's Exhaustive Coverage (G2/G3)",
            "Etsuko's Exhaustive Coverage (Pre/OP)",
        ]

        for j, training_event in enumerate(all_training_events):
            self.safe_click(driver, training_event)
            time.sleep(1)

            tooltip = driver.find_element(By.XPATH, "//div[@data-tippy-root]")
            try:
                ## TODO: Every time the code is run, the hexadecimals between sc- and -2 need to be updated right now, below comment doesn't work perfectly as well
                # tooltip_title = tooltip.find_element(By.XPATH, ".//div[contains(@class, 'sc-') and contains(@class, '-2 ')]").text
                tooltip_title = " ".join(tooltip.find_element(By.XPATH, "//div[contains(@class,'sc-428369cd-2')]").get_attribute("textContent").split())

                unwanted = ["(❯)", "(❯❯)", "(❯❯❯)"]
                for bad in unwanted:
                    tooltip_title = tooltip_title.replace(bad, "")

                if tooltip_title in events_ignore:
                    logging.info(f"Training event {tooltip_title} ({j + 1}/{len(all_training_events)}) was ignore. Skipping this...")
                    continue
                else: 
                    tooltip_title = tooltip_title.split("\n", 1)[0]
                    if tooltip_title in data_dict:
                        logging.info(f"Training event {tooltip_title} ({j + 1}/{len(all_training_events)}) was already scraped. Skipping this...")
                        continue
            except NoSuchElementException:
                logging.warning(f"No tooltip title found for training event ({j + 1}/{len(all_training_events)}).")
                continue

            tooltip_rows = tooltip.find_elements(By.XPATH, ".//div[contains(@class, 'sc-') and contains(@class, '-0 ')]")
            if len(tooltip_rows) == 0:
                logging.warning(f"No options found for training event {tooltip_title} ({j + 1}/{len(all_training_events)}).")
                continue

            logging.info(f"Found {len(tooltip_rows)} options for training event {tooltip_title} ({j + 1}/{len(all_training_events)}).")
            options = self.extract_training_event_options(tooltip_rows)
            data_dict[tooltip_title] = options

            ad_banner_closed = self.handle_ad_banner(driver, ad_banner_closed)

    def _sort_by_value(self, driver: uc.Chrome, value_key: str):
        """Sorts the list elements by the given value key.

        Args:
            driver (uc.Chrome): The Chrome driver.
            value_key (str): The key to sort by.
        """
        # Click on the "Sort by" dropdown and select the value key.
        sort_by_dropdown = driver.find_element(By.XPATH, "//select[contains(@id, ':r')]")
        sort_by_dropdown.click()
        time.sleep(0.5)
        value_option = sort_by_dropdown.find_element(By.XPATH, f".//option[@value='{value_key}']")
        value_option.click()
        time.sleep(0.5)


class CharacterScraper(BaseScraper):
    """Scrapes the characters from the website.

    Args:
        after_race_events (Dict[str, List[str]]): Preloaded "After a Race" events to copy to each character.
    """

    def __init__(self, after_race_events: Dict[str, List[str]]):
        super().__init__("https://gametora.com/umamusume/characters", "characters.json")
        self.after_race_events = after_race_events

    def start(self):
        """Starts the scraping process."""
        driver = create_chromedriver()
        driver.get(self.url)
        time.sleep(5)

        self.handle_cookie_consent(driver)

        # Sort the characters by release date descending order.
        self._sort_by_value(driver, "implemented")

        #Get buildId
        page_source = driver.page_source
        match = re.search(r'"buildId"\s*:\s*"([^"]+)"', page_source)
        if match:
            build_id = match.group(1)
            logging.info(f"buildId: {build_id}")
        else:
            logging.info(f"buildId not found")

        # Get all character links.
        character_grid = driver.find_element(By.XPATH, "//div[contains(@class, 'sc-dc9ce0a6-0')]")
        all_character_items = character_grid.find_elements(By.CSS_SELECTOR, "a.sc-df8b554e-1")
        # Filter out hidden elements using Selenium's is_displayed() method.
        # character_items = [item for item in all_character_items if item.is_displayed()]

        # logging.info(f"Found {len(character_items)} characters.")
        # character_links = [item.get_attribute("href") for item in character_items]

        # Filter out hidden elements and extract details
        character_details = []
        for item in all_character_items:
            if item.is_displayed():
                try:
                    # The <a> tag is the parent of the item div
                    link = item.get_attribute("href")
                    
                    # Find the <img> tag within the <div> item to get the source
                    img_tag = item.find_element(By.TAG_NAME, "img")
                    img_src = img_tag.get_attribute("src")
                    
                    character_details.append({
                        "link": link,
                        "img_src": img_src
                    })
                except NoSuchElementException:
                    logging.warning("Could not find link or image source for a visible item.")
        
        logging.info(f"Found {len(character_details)} visible character to process.")
        character_details.reverse()
        existing_count = 0

        # Iterate through each character.
        for i, details in enumerate(character_details):
            link      = details['link']
            img_src   = details['img_src']

            # Extract support_id from the URL
            support_id = link.rstrip('/').split('/')[-1].split('-')[0]

            # Skip if we already have this character
            if str(support_id) in self.data:
                existing_count += 1
                if not self.data[str(support_id)].get("implemented"):
                    # Navigate to the page
                    logging.info(f"Navigating to {link} ({i + 1}/{len(character_details)})")
                    driver.get(link)
                    time.sleep(3)

                    # Get the displayed name
                    character_name_raw = driver.find_element(
                        By.XPATH, "//main//h1"
                    ).text

                    # Build JSON endpoint and fetch extra data
                    url_name   = link.split("/")[-1]
                    final_url  = f"https://gametora.com/_next/data/{build_id}/umamusume/characters/{url_name}.json"
                    response   = requests.get(final_url)
                    data       = response.json()
                    time.sleep(5)
                    item       = data["pageProps"]["itemData"]
                    self.data[str(support_id)]["implemented"] = item.get("release_en")

                    logging.info(
                        f"Update implemented date {support_id} {self.data[str(support_id)]['name']} — already exists ({existing_count}) in JSON."
                    )
                else:
                    logging.info(
                        f"Skipping {support_id} {self.data[str(support_id)]['name']} — already exists ({existing_count}) in JSON."
                    )
                continue

            # Navigate to the page
            logging.info(f"Navigating to {link} ({i + 1}/{len(character_details)})")
            driver.get(link)
            time.sleep(3)

            # Get the displayed name
            character_name_raw = driver.find_element(
                By.XPATH, "//main//h1"
            ).text

            # Build JSON endpoint and fetch extra data
            url_name   = link.split("/")[-1]
            final_url  = f"https://gametora.com/_next/data/{build_id}/umamusume/characters/{url_name}.json"
            response   = requests.get(final_url)
            data       = response.json()
            time.sleep(5)

            item       = data["pageProps"]["itemData"]
            char_id    = item.get("char_id")
            char_name  = item.get("name_en")
            type_      = item.get("type")
            rarity_num = item.get("rarity")
            implemented = item.get("release_en")

            # Normalise rarity
            rarity = {3: "SSR", 2: "SR"}.get(rarity_num, "R")

            # Initialise the record
            self.data = {str(support_id): {}} | self.data
            self.data[str(support_id)].update({
                'id'        : str(support_id),
                'name'      : character_name_raw,
                'rarity'    : rarity,
                'image_url' : img_src,
                'implemented' : implemented
            })

            # Scrape training events and save
            self.process_training_events(
                driver,
                character_name_raw,
                self.data[str(support_id)],
                include_after_race_events=True,
            )
            self.save_data()

        
        driver.quit()


class SupportCardScraper(BaseScraper):
    """Scrapes the support cards from the website."""

    def __init__(self):
        super().__init__("https://gametora.com/umamusume/supports", "supports.json")

    def start(self):
        """Starts the scraping process."""
        driver = create_chromedriver()
        driver.get(self.url)
        time.sleep(5)

        self.handle_cookie_consent(driver)

        # Sort the support cards by release date descending order.
        self._sort_by_value(driver, "implemented")

        #Get buildId
        page_source = driver.page_source
        match = re.search(r'"buildId"\s*:\s*"([^"]+)"', page_source)
        if match:
            build_id = match.group(1)
            logging.info(f"buildId: {build_id}")
        else:
            logging.info(f"buildId not found")

        # Get all support card links.
        support_card_grid = driver.find_element(By.XPATH, "//div[contains(@class, 'sc-dc9ce0a6-0')]")
        all_support_card_items = support_card_grid.find_elements(By.CSS_SELECTOR, "a.sc-df8b554e-1")
        # Filter out hidden elements using Selenium's is_displayed() method.
        # filtered_support_card_items = [item for item in all_support_card_items if item.is_displayed()]

        # logging.info(f"Found {len(filtered_support_card_items)} support cards.")
        # support_card_links = [item.get_attribute("href") for item in filtered_support_card_items]
        card_details = []
        for item in all_support_card_items:
            if item.is_displayed():
                try:
                    # The <a> tag is the parent of the item div
                    link = item.get_attribute("href")
                    
                    # Find the <img> tag within the <div> item to get the source
                    img_tag = item.find_element(By.TAG_NAME, "img")
                    img_src = img_tag.get_attribute("src")
                    
                    card_details.append({
                        "link": link,
                        "img_src": img_src
                    })
                except NoSuchElementException:
                    logging.warning("Could not find link or image source for a visible item.")

        logging.info(f"Found {len(card_details)} visible support cards to process.")
        card_details.reverse()
        existing_count = 0
        # Iterate through each support card.
        for i, details in enumerate(card_details):
            link    = details['link']
            img_src = details['img_src']

            # Extract the support_id from the URL (format: …/supports/<support_id>-<slug>)
            support_id = link.rstrip('/').split('/')[-1].split('-')[0]

            # Skip if this support card is already stored
            if str(support_id) in self.data:
                existing_count += 1
                if not self.data[str(support_id)].get("implemented"):
                    # Navigate to the page
                    logging.info(f"Navigating to {link} ({i + 1}/{len(card_details)})")
                    driver.get(link)
                    time.sleep(3)

                    # Get the displayed name and clean it
                    support_card_name = driver.find_element(By.XPATH, "//main//h1").text
                    support_card_name = support_card_name.replace("Support Card", "").strip()

                    # Extract rarity from the name
                    rarity_match = re.search(r"\((SSR|SR|R)\)", support_card_name)
                    if rarity_match:
                        support_card_rarity = rarity_match.group(1)
                        support_card_name = support_card_name.replace(
                            f" ({support_card_rarity})", ""
                        ).strip()
                    else:
                        # Fallback – take the last token inside parentheses
                        support_card_rarity = (
                            support_card_name.split(" ")[-1]
                            .replace(")", "")
                            .replace("(", "")
                            .strip()
                        )

                    # Build the JSON endpoint and fetch extra data
                    url_name  = link.split("/")[-1]
                    final_url = f"https://gametora.com/_next/data/{build_id}/umamusume/supports/{url_name}.json"
                    response = requests.get(final_url)
                    data     = response.json()
                    time.sleep(3)

                    item = data["pageProps"]["itemData"]
                    self.data[str(support_id)]["implemented"] = item.get("release_en")

                    logging.info(
                        f"Update implemented date {support_id} {self.data[str(support_id)]['name']} — already exists ({existing_count}) in JSON."
                    )
                else:
                    logging.info(
                        f"Skipping {support_id} {self.data[str(support_id)]['name']} — already exists ({existing_count}) in JSON."
                    )
                continue

            # Navigate to the page
            logging.info(f"Navigating to {link} ({i + 1}/{len(card_details)})")
            driver.get(link)
            time.sleep(3)

            # Get the displayed name and clean it
            support_card_name = driver.find_element(By.XPATH, "//main//h1").text
            support_card_name = support_card_name.replace("Support Card", "").strip()

            # Extract rarity from the name
            rarity_match = re.search(r"\((SSR|SR|R)\)", support_card_name)
            if rarity_match:
                support_card_rarity = rarity_match.group(1)
                support_card_name = support_card_name.replace(
                    f" ({support_card_rarity})", ""
                ).strip()
            else:
                # Fallback – take the last token inside parentheses
                support_card_rarity = (
                    support_card_name.split(" ")[-1]
                    .replace(")", "")
                    .replace("(", "")
                    .strip()
                )

            # Build the JSON endpoint and fetch extra data
            url_name  = link.split("/")[-1]
            final_url = f"https://gametora.com/_next/data/{build_id}/umamusume/supports/{url_name}.json"
            response = requests.get(final_url)
            data     = response.json()
            time.sleep(3)

            item = data["pageProps"]["itemData"]
            char_id   = item.get("char_id")
            char_name = item.get("char_name")
            type_raw  = item.get("type")

            # Normalise the type field
            type_map = {
                "speed":        "SPD",
                "power":        "POW",
                "friend":       "PAL",
                "stamina":      "STA",
                "intelligence": "WIT",
                "guts":         "GUTS",
                "group":        "GRP",
            }
            type__ = type_map.get(type_raw, type_raw)

            # Initialise the record for the new card
            self.data = {str(support_id): {}} | self.data
            self.data[str(support_id)].update({
                'id'        : str(support_id),
                'name'      : f"{support_card_name} ({support_card_rarity}) ({type__})",
                'image_url' : img_src,
                'rarity'    : support_card_rarity,
                'type'      : type__,
            })

            # Scrape training events and save
            self.process_training_events(driver, support_card_name, self.data[str(support_id)])
            self.save_data()

        driver.quit()

def parse_outcome(text):
    """
    Handles normal and random outcomes:
    - Normal → [("-", text)]
    - Randomly either A or B with (~xx%) → success/fail
    - Randomly either A or B without % but has "chance" → ("Chance <percent>", ...)
    - Randomly either A or B without % or chance → ("Chance", ...)
    """
    original_text = text.strip()

    # Normal outcome
    if not original_text.lower().startswith("randomly either"):
        return [("-", original_text)]

    # Remove prefix
    text = original_text.replace("Randomly either", "", 1).strip()

    # Split into two outcomes
    parts = [p.strip().strip(",") for p in text.split(" or ")]

    # Check if percentages present (~90%)
    percent_pattern = r"\(~\d+%\)"
    has_percent = any(re.search(percent_pattern, p) for p in parts)

    # Check if chance appears (e.g. "50% chance")
    chance_match = re.search(r"(\d+%)\s*chance", original_text.lower())
    chance_value = chance_match.group(1) if chance_match else None

    results = []

    for idx, part in enumerate(parts):
        match = re.search(percent_pattern, part)

        if match:
            # Existing percent → success/fail
            percent = match.group(0)
            clean_text = part.replace(percent, "").strip().strip(",")
            success_type = ("Success " if idx == 0 else "Fail ") + percent

        else:
            clean_text = part

            if not has_percent:
                # Use detected chance amount
                if chance_value:
                    success_type = f"Chance {chance_value}"
                else:
                    success_type = "Chance"
            else:
                success_type = "-"

        results.append((success_type.strip(), clean_text))

    return results


def convert_all(char_file, support_file, output_file):
    with open(char_file, "r", encoding="utf-8") as f:
        characters_json = json.load(f)

    with open(support_file, "r", encoding="utf-8") as f:
        supports_json = json.load(f)


        scenario_extra = [
            {
            "char_id": "x1",
            "event_name": "Best Foot Forward!",
            "character_name": "URA Finale",
            "choice_text": "",
            "choice_number": "1",
            "relation": "URA Finale",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "-10 Energy;20 Power;20 Guts;Beeline Burst +1 Skill Hint"
            },
            {
            "char_id": "x1",
            "event_name": "Best Foot Forward!",
            "character_name": "URA Finale",
            "choice_text": "",
            "choice_number": "2",
            "relation": "URA Finale",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "30 Energy;20 Stamina;Breath of Fresh Air +1 Skill Hint"
            },
            {
            "char_id": "x1",
            "event_name": "A Trainer's Knowledge",
            "character_name": "URA Finale",
            "choice_text": "",
            "choice_number": "1",
            "relation": "URA Finale",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "10 Power;Estuko Otonahi Friendship +5"
            },
            {
            "char_id": "x1",
            "event_name": "A Trainer's Knowledge",
            "character_name": "URA Finale",
            "choice_text": "",
            "choice_number": "2",
            "relation": "URA Finale",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "10 Speed;Estuko Otonahi Friendship +5"
            },
            {
            "char_id": "x1",
            "event_name": "Exhilarating! What a Scoop!",
            "character_name": "URA Finale",
            "choice_text": "",
            "choice_number": "1",
            "relation": "URA Finale",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "10 Stamina;Estuko Otonahi Friendship +5"
            },
            {
            "char_id": "x1",
            "event_name": "Exhilarating! What a Scoop!",
            "character_name": "URA Finale",
            "choice_text": "",
            "choice_number": "2",
            "relation": "URA Finale",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "10 Guts;Estuko Otonahi Friendship +5"
            }, 
            {
            "char_id": "x0",
            "event_name": "Get Well Soon!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~92%)",
            "all_outcomes": "Mood -1, Last trained stat -5"
            },
            {
            "char_id": "x0",
            "event_name": "Get Well Soon!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~8%)",
            "all_outcomes": "Mood -1, Last trained stat -5, Get Practice Poor status"
            },
            {
            "char_id": "x0",
            "event_name": "Get Well Soon!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~30%)",
            "all_outcomes": "Mood -1, Last trained stat -10, "
            },
            {
            "char_id": "x0",
            "event_name": "Get Well Soon!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~55%)",
            "all_outcomes": "Mood -1, Last trained stat -10, Get Practice Poor status"
            },
            {
            "char_id": "x0",
            "event_name": "Get Well Soon!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~15%)",
            "all_outcomes": "Get Practice Perfect ○ status"
            },
            {
            "char_id": "x0",
            "event_name": "Don't Overdo It!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~50%)",
            "all_outcomes": "Energy +10, Mood -2, Last trained stat -10, 2 random stats -10, "
            },
            {
            "char_id": "x0",
            "event_name": "Don't Overdo It!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~50%)",
            "all_outcomes": "Energy +10, Mood -2, Last trained stat -10, 2 random stats -10, Get Practice Poor status"
            },
            {
            "char_id": "x0",
            "event_name": "Don't Overdo It!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~97%)",
            "all_outcomes": "Mood -3, Last trained stat -10, 2 random stats -10, Get Practice Poor status"
            },
            {
            "char_id": "x0",
            "event_name": "Don't Overdo It!",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~3%)",
            "all_outcomes": "Energy +10, Get Practice Perfect ○ status"
            },
            {
            "char_id": "x0",
            "event_name": "Extra Training",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~94%)",
            "all_outcomes": "Energy -5, Last trained stat +5, Yayoi Akikawa bond +5"
            },
            {
            "char_id": "x0",
            "event_name": "Extra Training",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Chance (~6%)",
            "all_outcomes": "Energy -5, Last trained stat +5, Heal a negative status effect, Yayoi Akikawa bond +5"
            },
            {
            "char_id": "x0",
            "event_name": "Extra Training",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy +5"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Success (~30%)",
            "all_outcomes": " All stats +20"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Fail (~70%)",
            "all_outcomes": " Mood -2, All stats -15, Get Night Owl status"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Success (~45%)",
            "all_outcomes": " Obtain Corner Recovery ○ skill, Obtain Straightaway Recovery skill"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Fail (~55%)",
            "all_outcomes": " Energy -20, Mood -2"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "3",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Success (~70%)",
            "all_outcomes": " Maximum Energy +12, Energy +40, Heal all negative status effects"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "3",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Fail (~30%)",
            "all_outcomes": " Energy -20, Mood -2, Get Practice Poor status"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "4",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Success (~85%)",
            "all_outcomes": " Energy +20, Mood +1, Get Charming ○ status"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "4",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "Fail (~15%)",
            "all_outcomes": " Energy -10/-20, Mood -1, (random) Get Practice Poor status"
            },
            {
            "char_id": "x0",
            "event_name": "Just an Acupuncturist, No Worries! ☆",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "5",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy +10"
            },
            {
            "char_id": "x0",
            "event_name": "Victory! (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15, 1 random stat +10, Skill points +45, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Victory! (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -5/-20, 1 random stat +10, Skill points +45, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Victory! (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15, 1 random stat +8, Skill points +35, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Victory! (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -5/-20, 1 random stat +8, Skill points +35, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Victory! (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15, 1 random stat +5, Skill points +30, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Victory! (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -5/-20, 1 random stat +5, Skill points +30, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Solid Showing (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -20, 1 random stat +8, Skill points +45, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Solid Showing (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -10/-30, 1 random stat +8, Skill points +45, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Solid Showing (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -20, 1 random stat +5, Skill points +35, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Solid Showing (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -10/-30, 1 random stat +5, Skill points +35, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Solid Showing (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -20, 1 random stat +3, Skill points +30, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Solid Showing (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -10/-30, 1 random stat +3, Skill points +30, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Defeat (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -25, 1 random stat +4, Skill points +25, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Defeat (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15/-35, 1 random stat +4, Skill points +25, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Defeat (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -25, 1 random stat +3, Skill points +20, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Defeat (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15/-35, 1 random stat +3, Skill points +20, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Defeat (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -25, Skill points +10, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Defeat (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15/-35, Skill points +10, (random) Hint for a skill related to the race"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -25, Mood -1, 1 random stat +4, Skill points +25, Etsuko Otonashi bond -10"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15, Mood +1, 1 random stat +4, Skill points +25, Etsuko Otonashi bond +15"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (G1)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -20, 1 random stat +4, Skill points +25, Etsuko Otonashi bond +10"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -25, Mood -1, 1 random stat +3, Skill points +20, Etsuko Otonashi bond -10"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15, Mood +1, 1 random stat +3, Skill points +20, Etsuko Otonashi bond +15"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (G2/G3)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -20, 1 random stat +3, Skill points +20, Etsuko Otonashi bond +10"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -25, Mood -1, Skill points +10, Etsuko Otonashi bond -10"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "1",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -15, Mood +1, Skill points +10, Etsuko Otonashi bond +15"
            },
            {
            "char_id": "x0",
            "event_name": "Etsuko's Exhaustive Coverage (Pre/OP)",
            "character_name": "All Umamusume",
            "choice_text": "",
            "choice_number": "2",
            "relation": "All Umamusume",
            "relation_type": "Umamusume",
            "success_type": "-",
            "all_outcomes": "Energy -20, Skill points +10, Etsuko Otonashi bond +10"
            },
            {
            "char_id": "x2",
            "event_name": "A Team at Last",
            "character_name": "Unity Cup",
            "choice_text": "Happy Hoppers (Taiki Shuttle)",
            "choice_number": "1",
            "relation": "Unity Cup",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "Mile Maven +1 (Awarded upon clearing Unity Cup) Skill Hint"
            },
            {
            "char_id": "x2",
            "event_name": "A Team at Last",
            "character_name": "Unity Cup",
            "choice_text": "Sunny Runners (Fukukitaru)",
            "choice_number": "2",
            "relation": "Unity Cup",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "Clairvoyance +1 (Awarded upon clearing Unity Cup) Skill Hint"
            },
            {
            "char_id": "x2",
            "event_name": "A Team at Last",
            "character_name": "Unity Cup",
            "choice_text": "Carrot Pudding (Haru Urara)",
            "choice_number": "3",
            "relation": "Unity Cup",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "Indomitable +1 (Awarded upon clearing Unity Cup) Skill Hint"
            },
            {
            "char_id": "x2",
            "event_name": "A Team at Last",
            "character_name": "Unity Cup",
            "choice_text": "Blue Bloom (Rice Shower)",
            "choice_number": "4",
            "relation": "Unity Cup",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "Cooldown +1 (Awarded upon clearing Unity Cup) Skill Hint"
            },
            {
            "char_id": "x2",
            "event_name": "A Team at Last",
            "character_name": "Unity Cup",
            "choice_text": "Team Carrot",
            "choice_number": "5",
            "relation": "Unity Cup",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "No Stopping Me! +1 (Awarded upon clearing Unity Cup) Skill Hint"
            },
            {
            "char_id": "x2",
            "event_name": "Tutorial",
            "character_name": "Unity Cup",
            "choice_text": "Yes, please.",
            "choice_number": "1",
            "relation": "Unity Cup",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "Show unity cup tutorial."
            },
            {
            "char_id": "x2",
            "event_name": "Tutorial",
            "character_name": "Unity Cup",
            "choice_text": "No, thank you.",
            "choice_number": "2",
            "relation": "Unity Cup",
            "relation_type": "Scenario",
            "success_type": "-",
            "all_outcomes": "Skip unity cup tutorial."
            }
        ]

    choices_output = []
    character_output = []
    support_output = []
    row_id = 1

    # =======================
    # PROCESS CHARACTERS.JSON
    # =======================
    for char_id, data in characters_json.items():
        character_output.append({
            "id": char_id,
            "name": data.get("name"),
            "rarity": data.get("rarity"),
            "image_url": data.get("image_url")
        })

        char_name = data.get("name")
        ignore_keys = {"id", "name", "rarity", "image_url","implemented"}

        event_keys = [k for k in data.keys() if k not in ignore_keys]

        for event_name in event_keys:
            choices = data[event_name]

            # ⛔ SKIP EVENTS WITH ONLY 1 CHOICE
            if len(choices) <= 1:
                continue

            for idx, choice in enumerate(choices):
                parsed_outcomes = parse_outcome(choice)

                for success_type, outcome_text in parsed_outcomes:
                    choices_output.append({
                        # "id": str(row_id),
                        "char_id": char_id,
                        "event_name": event_name,
                        "character_name": char_name,
                        "choice_text": "",
                        "choice_number": str(idx + 1),
                        "relation": char_name,
                        "relation_type": "Umamusume",
                        "success_type": success_type,
                        "all_outcomes": outcome_text
                    })
                    row_id += 1

    # =======================
    # PROCESS SUPPORTS.JSON
    # =======================
    for support_id, data in supports_json.items():
        rarity_rank = {"SSR": 3, "SR": 2, "R": 1}

        # When adding a new support
        new_support = {
            "id": support_id,
            "name": data.get("name"),
            "image_url": data.get("image_url"),
            "rarity": data.get("rarity"),
            "type": data.get("type")
        }

        # Find the correct index to insert so the list stays sorted
        insert_index = 0
        for i, s in enumerate(support_output):
            # If existing support has lower rarity, insert before it
            if rarity_rank.get(new_support["rarity"], 0) > rarity_rank.get(s["rarity"], 0):
                break
            insert_index += 1

        support_output.insert(insert_index, new_support)

        support_name = data.get("name")
        support_type = data.get("type")
        ignore_keys = {"id", "name", "rarity", "image_url", "type","implemented"}

        event_keys = [k for k in data.keys() if k not in ignore_keys]

        for event_name in event_keys:
            choices = data[event_name]

            # ⛔ SKIP EVENTS WITH ONLY 1 CHOICE
            if len(choices) <= 1:
                continue

            for idx, choice in enumerate(choices):
                parsed_outcomes = parse_outcome(choice)

                for success_type, outcome_text in parsed_outcomes:
                    choices_output.append({
                        # "id": str(row_id),
                        "char_id": support_id,
                        "event_name": event_name,
                        "character_name": support_name,
                        "type": support_type,
                        "choice_text": "",
                        "choice_number": str(idx + 1),
                        "relation": support_name,
                        "relation_type": "Support Card",
                        "success_type": success_type,
                        "all_outcomes": outcome_text
                    })
                    row_id += 1

    # =======================
    # ADD SCENARIO EVENTS
    # =======================
    for entry in scenario_extra:
        choices_output.append({
            # "id": str(row_id),
            "char_id": entry["char_id"],
            "event_name": entry["event_name"],
            "character_name": entry["character_name"],
            "choice_text": entry["choice_text"],
            "choice_number": entry["choice_number"],
            "relation": entry["relation"],
            "relation_type": entry["relation_type"],
            "success_type": entry["success_type"],
            "all_outcomes": entry["all_outcomes"]
            })
        row_id += 1

    # =======================
    # FINAL OUTPUT FORMAT
    # =======================
    final_output = {
        "choiceArraySchema": {
            "choices": choices_output
        },
        "characterArraySchema": {
            "characters": character_output
        },
        "supportCardArraySchema": {
            "supportCards": support_output
        },
        "scenarios": [
            {
                "name": "URA Finale",
                "image_url": "https://gametora.com/images/umamusume/scenarios/bnr_ico_001.png"
            },
            {
                "name": "Unity Cup",
                "image_url": "https://gametora.com/images/umamusume/scenarios/bnr_ico_002.png"
            }
        ]
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(final_output, f, indent=2, ensure_ascii=False)

    logging.info(f"Conversion complete! Output saved to '{output_file}'.")


if __name__ == "__main__":
    logging.basicConfig(format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO)
    start_time = time.time()

    after_race_events = load_after_race_events()
    character_scraper = CharacterScraper(after_race_events)
    character_scraper.start()

    support_card_scraper = SupportCardScraper()
    support_card_scraper.start()

    convert_all("characters.json", "supports.json", "../data/events.json")

    end_time = round(time.time() - start_time, 2)
    logging.info(f"Total time for processing all applications: {end_time} seconds or {round(end_time / 60, 2)} minutes.")
