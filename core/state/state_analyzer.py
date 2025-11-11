# core_emu/state/state_analyzer.py
import re
from .state_bot import BotState
from core.ocr import OCR
from core.recognizer import Recognizer
from utils import helper, constants, log


class StateAnalyzer:
    def __init__(self, ocr: OCR, recognizer: Recognizer):
        self.ocr = ocr
        self.recognizer = recognizer
        self.digit_replacement = {
            "O": "0",
            "o": "0",
            "I": "1",
            "l": "1",
            "[": "1",
            "]": "1",
            "|": "1",
            "S": "5",
            "s": "5",
            "Z": "2",
            "z": "2",
            "A": "4",
            "B": "8",
            "b": "8",
        }

    def analyze_current_state(self, screen) -> BotState:
        energy_level, max_energy = self._check_energy_level(screen)

        return BotState(
            mood=self._check_mood(screen),
            turn=self._check_turn(screen),
            year=self._check_year(screen),
            energy_level=energy_level,
            max_energy=max_energy,
            current_stats=self._check_stats(screen),
            criteria=self._check_criteria(screen),
            skill_pts=self._check_skill_pts(screen),
        )

    def _check_stats(self, screen):
        stat_regions = {
            "spd": constants.SPD_STAT_REGION,
            "sta": constants.STA_STAT_REGION,
            "pwr": constants.PWR_STAT_REGION,
            "guts": constants.GUTS_STAT_REGION,
            "wit": constants.WIT_STAT_REGION,
        }

        result = {}
        for stat, region in stat_regions.items():
            img = helper.crop_screen(screen, region)
            val = self.ocr.extract_number(img)
            result[stat] = val
        return result

    def _check_mood(self, screen):
        img = helper.crop_screen(screen, constants.MOOD_REGION)
        img = helper.enhance_img(img)

        mood_text = self.ocr.extract_text(img).upper().strip()
        log.debug(f"Raw mood text: '{mood_text}'")

        # 1. Exact match first
        for known_mood in constants.MOOD_LIST:
            if known_mood.upper() in mood_text:
                return known_mood

        # If mood text is empty, fuzzy matching will match it with BAD
        if not mood_text:
            return "UNKNOWN"

        # 2. Fuzzy matching with Levenshtein distance
        best_match = None
        best_distance = float("inf")
        threshold = 3  # Maximum allowed distance

        for known_mood in constants.MOOD_LIST:
            distance = self._levenshtein_distance(mood_text, known_mood.upper())
            if distance < best_distance:
                best_distance = distance
                best_match = known_mood

        # 3. Check if best match is within threshold
        if best_match and best_distance <= threshold:
            log.info(
                f"Fuzzy matched mood: '{mood_text}' -> '{best_match}' (distance: {best_distance})"
            )
            return best_match

        log.warning(
            f"Mood not recognized: '{mood_text}' (closest: '{best_match}' with distance {best_distance})"
        )
        return "UNKNOWN"

    def _check_turn(self, screen):
        img = helper.crop_screen(screen, constants.TURN_REGION)
        img = helper.enhance_img(img, threshold=200)
        turn_text = self.ocr.extract_text(img)

        log.debug(f"Raw turn text: '{turn_text}'")

        if "Race" in turn_text or "Day" in turn_text:
            return "Race Day"

        if not turn_text:
            return -1

        # Fuzzy matching for safety
        race_day_distance = self._levenshtein_distance(turn_text.upper(), "RACE DAY")
        threshold = 3

        if race_day_distance <= threshold:
            log.debug(f"Fuzzy matched turn: {turn_text}, distance: {race_day_distance}")
            return "Race Day"

        cleaned_text = turn_text
        for wrong, correct in self.digit_replacement.items():
            cleaned_text = cleaned_text.replace(wrong, correct)

        # Extract digits
        match_digits = re.search(r"(\d+)", cleaned_text)

        if match_digits:
            digits = match_digits.group(1)
            return int(digits)

        return -1

    def _check_year(self, screen):
        img = helper.crop_screen(screen, constants.YEAR_REGION)
        img = helper.enhance_img(img)
        text = self.ocr.extract_text(img)
        return text

    def _check_criteria(self, screen):
        img = helper.crop_screen(screen, constants.CRITERIA_REGION)
        img = helper.enhance_img(img)
        return self.ocr.extract_text(img)

    def _check_skill_pts(self, screen):
        img = helper.crop_screen(screen, constants.SKILL_PTS_REGION)
        img = helper.enhance_img(img)
        return self.ocr.extract_number(img)

    def _check_energy_level(self, screen):
        right_bar_match = self.recognizer.match_template(
            template_path="assets/ui/energy_bar_right_end_part.png",
            region=constants.ENERGY_BBOX,
            screen=screen,
        )

        if not right_bar_match:
            right_bar_match = self.recognizer.match_template(
                template_path="assets/ui/energy_bar_right_end_part_2.png",
                region=constants.ENERGY_BBOX,
                screen=screen,
            )

        if right_bar_match:
            x, y, w, h = right_bar_match[0]
            energy_bar_length = x

            x, y, w, h = constants.ENERGY_BBOX
            top_bottom_middle_pixel = round((y + h) / 2, 0)

            MAX_ENERGY_BBOX = (
                int(x),
                int(top_bottom_middle_pixel),
                int(x + energy_bar_length),
                1,
            )

            empty_energy_pixel_count = self.recognizer.count_pixels_of_color(
                [115, 115, 115], MAX_ENERGY_BBOX, screen=screen, tolerance=6
            )

            total_energy_length = energy_bar_length - 1
            hundred_energy_pixel_constant = 236

            energy_level = (
                (total_energy_length - empty_energy_pixel_count)
                / hundred_energy_pixel_constant
            ) * 100
            max_energy = total_energy_length / hundred_energy_pixel_constant * 100

            return energy_level, max_energy
        else:
            log.warning("Couldn't find energy bar")
            return -1, -1

    def _check_failure(self, screen=None):
        percentage_img = self.recognizer.match_template(
            template_path="assets/icons/buy_skill.png",
            screen=screen,
            grayscale=True,
        )
        if not percentage_img:
            return -1
        x, y, w, h = percentage_img[0]
        failure_region = (x - 50, y, w + 50, h)

        img = helper.crop_screen(screen, failure_region)
        img = helper.enhance_img(img, threshold=200)
        failure_text = self.ocr.extract_text(img)
        log.debug(f"Failure text debug: '{failure_text}'")

        cleaned_text = failure_text
        for wrong, correct in self.digit_replacement.items():
            cleaned_text = cleaned_text.replace(wrong, correct)

        log.debug(f"Cleaned text: '{cleaned_text}'")

        # Extract digits
        match_digits = re.search(r"(\d+)", cleaned_text)

        if match_digits:
            digits = match_digits.group(1)
            log.debug(f"Digits: {digits}")
            return int(digits)

        return -1

    def _check_status_effects(self, screen):
        status_effects_screen = helper.enhance_img(screen)

        status_effects_text = self.ocr.extract_text(status_effects_screen)
        log.debug(f"Status effects text: {status_effects_text}")

        normalized_text = status_effects_text.lower().replace(" ", "")
        matches = [
            k
            for k in constants.BAD_STATUS_EFFECTS
            if k.lower().replace(" ", "") in normalized_text
        ]

        total_severity = sum(
            constants.BAD_STATUS_EFFECTS[k]["Severity"] for k in matches
        )
        log.debug(f"Matches: {matches}, severity: {total_severity}")
        return matches, total_severity

    def _levenshtein_distance(self, s1, s2):
        """Calculate Levenshtein distance between two strings"""
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)

        if len(s2) == 0:
            return len(s1)

        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row

        return previous_row[-1]
