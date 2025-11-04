from .event_matcher import EventMatcher
from core.actions import Interaction
from core.ocr import OCR
import core.config as config
from utils.helper import crop_screen, enhance_img, sleep
from utils.assets_repository import get_icon
from utils.log import debug
import utils.constants as constants


class EventManager:
    def __init__(self, interaction: Interaction, ocr: OCR):
        self.threshold = 0.8
        self.interaction = interaction
        self.ocr = ocr
        self.matcher = EventMatcher()

    def select_event(self, screen):
        event_choices_icon = self.interaction.recognizer.match_template(
            template_path=get_icon("event_choice_1"), screen=screen
        )
        choice_vertical_gap = 112

        if not event_choices_icon:
            return False

        if len(event_choices_icon) == 1:
            debug("Event found, but only 1 option. return.")
            return False

        debug(f"Total choices on the screen: {len(event_choices_icon)}")

        if not config.USE_OPTIMAL_EVENT_CHOICE:
            self.interaction.click_boxes(
                event_choices_icon, text="Event found, selecting top choice."
            )
            return True

        event_name = self._get_event_name(screen)

        chosen = self._event_choice(event_name)
        if chosen == 0:
            self.interaction.click_boxes(
                event_choices_icon,
                text="Event found, selecting top choice.",
            )
            return True

        x = event_choices_icon[0][0]
        y = event_choices_icon[0][1] + ((chosen - 1) * choice_vertical_gap)
        debug(f"Event choices coordinates: {event_choices_icon}")
        debug(f"Clicking: {x}, {y}")
        self.interaction.click_coordinates(
            x,
            y,
            text=f"Selecting optimal choice: {event_name}",
        )
        sleep(0.5)
        if "Acupuncturist" in event_name:
            self.interaction.click_coordinates(
                x,
                event_choices_icon[0][1] + ((4 - 1) * choice_vertical_gap),
                text="Confirm Acupuncturist",
            )
        return True

    def _event_choice(self, event_name):
        choice = 0

        if not event_name:
            return choice

        best_event_name, similarity = self.matcher.find_best_match(
            event_name, config.EVENT_CHOICES
        )
        debug(f"Best event name match: {best_event_name}, similarity: {similarity}")

        if similarity >= self.threshold:
            events = next(
                (e for e in config.EVENT_CHOICES if e["event_name"] == best_event_name),
                None,  # fallback
            )
            debug(
                f"Event found: {event_name} has {similarity * 100:.2f}% similarity with {events['event_name']}"
            )
            debug(f"event name: {events['event_name']}, chosen: {events['chosen']}")
            choice = events["chosen"]
            return choice
        else:
            debug(
                f"No event found, {event_name} has {similarity * 100:.2f}% similarity with {best_event_name}"
            )
            return choice

    def _get_event_name(self, screen):
        img = crop_screen(screen, constants.EVENT_NAME_REGION)
        img = enhance_img(img, threshold=225)
        text = self.ocr.extract_text(img)
        debug(f"Event name: {text}")
        return text
