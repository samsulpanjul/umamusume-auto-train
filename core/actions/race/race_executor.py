# core/actions/race/race_executor.py
from core.actions.base import Interaction
from core.actions.race.position_manager import PositionManager

from utils.log import info, debug
from utils.helper import sleep, get_secs
from utils import assets_repository


class RaceExecutor:
    def __init__(self, interaction: Interaction, position_manager: PositionManager):
        self.interaction = interaction
        self.position_manager = position_manager

    def execute_race(self):
        """Execute complete race flow"""
        sleep(5)
        self.position_manager.select_position()
        self._handle_pre_race()
        self._handle_post_race()

    def _handle_pre_race(self):
        """Handle race start and viewing"""
        view_result = self.interaction.recognizer.locate_on_screen(
            assets_repository.get_button("view_results"),
            max_search_time=60 # adding time buffer in case it doesn't finish loading
        )

        if view_result:
            if self.interaction.recognizer.is_btn_active(view_result, threshold=200):
                self._skip_race_results(view_result)
            else:
                self._watch_race()

    def _skip_race_results(self, view_result):
        """Skip race results quickly"""
        self.interaction.click_boxes(view_result, clicks=3)
        sleep(0.5)

        # Click center multiple times to skip animations
        for i in range(2):
            self.interaction.click_coordinates(400, 540, clicks=3)
            sleep(0.5)

    def _watch_race(self):
        """Watch and skip race scene"""
        if not self.interaction.click_element(
            assets_repository.get_button("race_watch_btn"), max_search_time=get_secs(10)
        ):
            return

        info(f"Watching race, waiting for {get_secs(15)}sec(s)...")
        sleep(15)

        # Skip race scene
        self._skip_race_scene()

    def _skip_race_scene(self):
        """Skip race scene sequences"""
        # Click exclamation mark
        self.interaction.click_element(
            assets_repository.get_button("race_exclamation_btn"),
            max_search_time=get_secs(10),
        )
        sleep(0.5)

        for i in range(4):  # Multiple skip attempts
            self.interaction.click_element(
                assets_repository.get_button("skip_btn"), clicks=3
            )
            sleep(2 if i == 2 else 0.5)  # Longer wait in middle

        # Close trophy if any
        self.interaction.click_element(
            assets_repository.get_button("close_btn"),
            max_search_time=get_secs(2),
            clicks=3,
        )

        info("Finished race skipping.")

    def _handle_post_race(self):
        """Handle post-race flow"""
        sleep(1)
        if not self.interaction.click_element(
            assets_repository.get_button("next_btn"), max_search_time=get_secs(5)
        ):
            return
        sleep(0.3)

        self.interaction.click_coordinates(400, 540, clicks=2)
        sleep(0.3)

        self.interaction.click_element(
            assets_repository.get_button("next2_btn"), max_search_time=get_secs(5)
        )
