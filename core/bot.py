# core/bot.py
import core.config as config
from core.ocr import OCR
from core.recognizer import Recognizer
from core.state.state_analyzer import StateAnalyzer
from core.state.state_bot import BotState
from utils.adb_helper import ADB
from utils.log import debug, error, info, warning
from utils.helper import sleep
from utils.assets_repository import get_icon
from core.actions.base import Interaction, Input, Navigation
from core.actions import (
    InfirmaryManager,
    TrainingManager,
    SkillManager,
    RaceManager,
    EventManager,
)


class Bot:
    templates = {
        "tazuna": "assets/ui/tazuna_hint.png",
        "retry": "assets/buttons/retry_btn.png",
        "event": "assets/icons/event_choice_1.png",
        "inspiration": "assets/buttons/inspiration_btn2.png",
        "cancel": "assets/buttons/cancel_btn.png",
        "next": "assets/buttons/next_btn.png",
        "next2": "assets/buttons/next2_btn.png",
        "infirmary": "assets/buttons/infirmary_btn.png",
    }

    def __init__(self, adb: ADB = None):
        self.is_running = False
        self.adb = adb

        # Initialize components
        self.ocr = OCR()
        self.recognizer = Recognizer(0.8, adb)
        self.state_analyzer = StateAnalyzer(self.ocr, self.recognizer)
        self.input = Input(adb, self)
        self.interaction = Interaction(self.input, self.recognizer)
        self.navigation = Navigation(self.interaction)

        self.skill = SkillManager(self.interaction, self.ocr, self.navigation)
        self.infirmary_manager = InfirmaryManager(self.interaction, self.state_analyzer)
        self.event = EventManager(self.interaction, self.ocr)
        self.race = RaceManager(self.interaction, self.navigation, self.ocr)

        self.preferred_position_set = False
        self.training = None

    def start(self):
        self.is_running = True
        info("Bot starting...")

    def stop(self):
        self.is_running = False
        info("Bot stopped.")

    def run(self):
        while self.is_running:
            sleep(0.5)

            # 1. take screenshot
            screen = self.adb.screenshot()

            # 2. Handle UI elements
            matches = self.recognizer.multi_match_templates(self.templates, screen)

            if self.event.select_event(screen):
                continue
            if self.interaction.click_boxes(
                matches["inspiration"], text="Inspiration found."
            ):
                continue
            if matches["cancel"]:
                if self.recognizer.locate_on_screen(get_icon("clock_icon")):
                    debug("Lost race, wait for input")
                    continue
                else:
                    self.interaction.click_boxes(matches["cancel"], text="cancel.")
                    continue
            if self.interaction.click_boxes(matches["next"], text="next."):
                continue
            if self.interaction.click_boxes(matches["next2"], text="next2."):
                continue
            if self.interaction.click_boxes(matches["retry"], text="retry"):
                continue

            if not matches["tazuna"]:
                print(".", end="")
                continue

            # 3. analyze state
            state = self.state_analyzer.analyze_current_state(screen)

            info("Checking state")

            # 4. Print state info
            print(
                "\n=======================================================================================\n"
            )
            info(f"Year: {state.year}")
            info(f"Mood: {state.mood}")
            info(f"Turn: {state.turn}")
            info(f"Energy: {state.energy_level:.2f}")
            info(f"Criteria: {state.criteria}")
            if state.is_race_day:
                info(f"Skill pts: {state.skill_pts}")
            else:
                info(f"Stat: {state.current_stats}")
            print(
                "\n=======================================================================================\n"
            )

            # 5. Main game logic
            if state.is_race_day:
                if "Finale" in state.year:
                    debug("URA Finale!!!!")
                    self._handle_ura_finale(state)
                    continue
                else:
                    debug("Race Day!!!!")
                    self._handle_race_day(state)
                    continue

            if state.should_prioritize_g1:
                debug("Race schedule!")
                if self._handle_g1_race(state):
                    continue

            if state.should_race_for_goals:
                debug("Race Goal!!")
                if self._handle_goal_race():
                    continue

            if self.infirmary_manager.handle_infirmary_decision(state, matches, screen):
                debug("Infirmary!")
                continue
            if state.needs_increase_mood:
                if self.infirmary_manager.should_force_infirmary_after_skip():
                    info(
                        "Severe condition found, visiting infirmary even though we will waste some energy."
                    )
                    self.infirmary_manager.visit_infirmary()
                    continue
                info("Mood is low, trying recreation to increase mood")
                self.navigation.do_recreation(state.is_summer)
                continue

            debug("handle_training")
            self._handle_training(state)

    def _handle_race_day(self, state: BotState):
        """Handle race day logic"""
        info("Race day.")

        if state.is_buy_skill:
            self.skill.buying_skills()

        sleep(0.5)
        self.race.handle_race_day(is_finale=False)

    def _handle_ura_finale(self, state: BotState):
        """Handle race day logic"""
        info("Race day.")

        if state.is_buy_skill:
            self.skill.buying_skills()

        sleep(0.5)
        self.race.handle_race_day(is_finale=True)

    def _handle_g1_race(self, state: BotState) -> bool:
        """Handle G1 race priority"""
        race_done = False
        for race_list in config.RACE_SCHEDULE:
            if len(race_list):
                if race_list["year"] in state.year and race_list["date"] in state.year:
                    debug(
                        f"Race now, {race_list['name']}, {race_list['year']} {race_list['date']}"
                    )
                    if self.race.handle_g1_race(race_list["name"]):
                        race_done = True
                        break
        return race_done

    def _handle_goal_race(self) -> bool:
        """Handle goal-based race"""
        race_found = self.race.handle_goal_race()
        if race_found:
            return True
        else:
            sleep(0.5)
            return False

    def _handle_training(self, state: BotState):
        """Handle training flow"""
        if not self.navigation.go_to_training():
            info("Training button not found.")
            return

        sleep(0.5)

        self.training = TrainingManager(
            self.interaction,
            self.state_analyzer,
            state.energy_level,
            state.current_stats,
        )

        if self.training.do_train(state.year):
            return
        else:
            self.navigation.go_back()
            sleep(0.5)
            if state.never_rest:
                info(f"Energy above {config.NEVER_REST_ENERGY}, skipping rest")
                return

            self.navigation.do_rest(state.is_summer)
