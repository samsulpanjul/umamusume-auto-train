# core/actions/training/support_analyzer.py
from math import floor

from core.actions.base import Interaction
from core.state.state_analyzer import StateAnalyzer
import core.config as config

import utils.constants as constants
from utils import assets_repository
from utils.log import info, warning, error, debug
from utils.helper import sleep, get_secs, get_center


class SupportAnalyzer:
    # spd often misrecognized as sta, so use fixed coord now instead relying on image matching
    # training_types = {
    #     "spd": assets_repository.get_icon("train_spd"),
    #     "sta": assets_repository.get_icon("train_sta"),
    #     "pwr": assets_repository.get_icon("train_pwr"),
    #     "guts": assets_repository.get_icon("train_guts"),
    #     "wit": assets_repository.get_icon("train_wit"),
    # }

    SUPPORT_ICONS = {
        "spd": assets_repository.get_icon("support_card_type_spd"),
        "sta": assets_repository.get_icon("support_card_type_sta"),
        "pwr": assets_repository.get_icon("support_card_type_pwr"),
        "guts": assets_repository.get_icon("support_card_type_guts"),
        "wit": assets_repository.get_icon("support_card_type_wit"),
        "friend": assets_repository.get_icon("support_card_type_friend"),
    }

    SUPPORT_FRIEND_LEVELS = {
        "gray": [110, 108, 120],
        "blue": [42, 192, 255],
        "green": [162, 230, 30],
        "yellow": [255, 173, 30],
        "max": [255, 235, 120],
    }

    def __init__(self, interaction: Interaction, state_analyzer: StateAnalyzer):
        self.interaction = interaction
        self.state_analyzer = state_analyzer

    def check_support_card(self, screen=None):

        count_result = {}

        count_result["total_supports"] = 0
        count_result["total_hints"] = 0
        count_result["total_friendship_levels"] = {}

        for friend_level, color in self.SUPPORT_FRIEND_LEVELS.items():
            count_result["total_friendship_levels"][friend_level] = 0

        hint_matches = self.interaction.recognizer.match_template(
            constants.SUPPORT_CARD_ICON_BBOX,
            assets_repository.get_icon("support_hint"),
            screen,
        )
        for key, icon_path in self.SUPPORT_ICONS.items():
            count_result[key] = {}
            count_result[key]["supports"] = 0
            count_result[key]["hints"] = 0
            count_result[key]["friendship_levels"] = {}

            for friend_level, color in self.SUPPORT_FRIEND_LEVELS.items():
                count_result[key]["friendship_levels"][friend_level] = 0

            matches = self.interaction.recognizer.match_template(
                constants.SUPPORT_CARD_ICON_BBOX, icon_path, screen
            )
            for match in matches:
                # add the support as a specific key
                count_result[key]["supports"] += 1
                # also add it to the grand total
                count_result["total_supports"] += 1

                # find friend colors and add them to their specific colors
                x, y, w, h = match
                match_horizontal_middle = floor((2 * x + w) / 2)
                match_vertical_middle = floor((2 * y + h) / 2)
                icon_to_friend_bar_distance = 63
                bbox_left = (
                    match_horizontal_middle + constants.SUPPORT_CARD_ICON_BBOX[0]
                )
                bbox_top = (
                    match_vertical_middle
                    + constants.SUPPORT_CARD_ICON_BBOX[1]
                    + icon_to_friend_bar_distance
                )
                wanted_pixel = (bbox_left, bbox_top, 1, 1)  # xywh
                friendship_level_color = (
                    self.interaction.recognizer.find_color_of_pixel(
                        wanted_pixel, screen
                    )
                )
                friend_level = self.interaction.recognizer.closest_color(
                    self.SUPPORT_FRIEND_LEVELS, friendship_level_color
                )
                count_result[key]["friendship_levels"][friend_level] += 1
                count_result["total_friendship_levels"][friend_level] += 1

                if hint_matches:
                    for hint_match in hint_matches:
                        distance = abs(hint_match[1] - match[1])
                        if distance < 45:
                            count_result["total_hints"] += 1
                            count_result[key]["hints"] += 1

        return count_result

    def check_training(self):
        failure_regions = {
            "spd": constants.SPD_FAILURE_REGION,
            "sta": constants.STA_FAILURE_REGION,
            "pwr": constants.PWR_FAILURE_REGION,
            "guts": constants.GUTS_FAILURE_REGION,
            "wit": constants.WIT_FAILURE_REGION,
        }
        results = {}

        # failcheck enum "train","no_train","check_all"
        failcheck = "check_all"
        margin = 5
        x1, y1 = 400, 540
        for key, coord in constants.TRAINING_ICON_COORD.items():

            # pos = self.interaction.recognizer.locate_on_screen(
            #     icon_path, max_search_time=2
            # )
            sleep(0.5)
            cx, cy = coord
            self.interaction.swipe_between_points(x1, y1, cx, cy)
            sleep(0.2)

            screen = self.interaction.input.take_screenshot()
            support_card_results = self.check_support_card(screen=screen)
            gains = self.state_analyzer._check_gains(screen=screen, key=key)
            failure_region = failure_regions.get(key)

            if key != "wit":
                if failcheck == "check_all":
                    failure_chance = self.state_analyzer._check_failure(
                        screen, failure_region
                    )
                    if failure_chance > (config.MAX_FAILURE + margin):
                        info("Failure rate too high skip to check wit")
                        failcheck = "no_train"
                        failure_chance = failure_chance  # config.MAX_FAILURE
                    elif failure_chance < (config.MAX_FAILURE - margin):
                        info(
                            "Failure rate is low enough, skipping the rest of failure checks."
                        )
                        failcheck = "train"
                        failure_chance = failure_chance  # 0
                elif failcheck == "no_train":
                    failure_chance = failure_chance  # config.MAX_FAILURE
                elif failcheck == "train":
                    failure_chance = failure_chance  # 0
            else:
                if failcheck == "train":
                    failure_chance = failure_chance  # 0
                else:
                    failure_chance = self.state_analyzer._check_failure(
                        screen, failure_region
                    )

            support_card_results["failure"] = failure_chance
            results[key] = support_card_results

            # Compact debug version
            print("")
            debug(
                f"[{key.upper()}] → Supports: {support_card_results['total_supports']}, "
                + f"Hints: {support_card_results['total_hints']}, "
                + f"Fail: {failure_chance}%, "
                + f"Levels: {support_card_results['total_friendship_levels']}, "
                + f"Gains: {gains}"
            )

            # Debug individual support types
            for support_type in ["spd", "sta", "pwr", "guts", "wit", "friend"]:
                if (
                    support_type in support_card_results
                    and support_card_results[support_type]["supports"] > 0
                ):
                    data = support_card_results[support_type]
                    debug(
                        f"[{key.upper()}] → {support_type.upper()}: {data['supports']}s/{data['hints']}h "
                        + f"({', '.join([f'{lvl}:{cnt}' for lvl, cnt in data['friendship_levels'].items() if cnt > 0])})"
                    )
            sleep(0.1)

        return results
