# core/skill/skill_manager.py
from .skill_buyer import SkillBuyer
from .skill_matcher import SkillMatcher

from core.actions.base import Interaction, Navigation
from core.ocr import OCR
import core.config as config

from utils.log import info
from utils.helper import sleep
from utils import assets_repository


class SkillManager:
    def __init__(
        self,
        interaction: Interaction,
        ocr: OCR,
        navigation: Navigation,
    ):
        self.interaction = interaction
        self.ocr = ocr
        self.navigation = navigation

        self.matcher = SkillMatcher(threshold=0.85)
        self.buyer = SkillBuyer(interaction, ocr, self.matcher)

    def buying_skills(self) -> bool:
        """Main skill auto-buy flow"""
        info("Starting auto skill purchase")

        if not self.navigation.go_to_skills():
            return False

        sleep(0.5)

        success = self.buyer.buy_skills(config.SKILL_LIST)

        if success:
            if self._complete_purchase():
                self.navigation.go_back("Successfully bought skills, returning.")
            return
        else:
            self.navigation.go_back("No matching skills found. Going back.")
            return False

    def _complete_purchase(self) -> bool:
        """Complete skill purchase flow"""
        steps = [
            (assets_repository.get_button("confirm_btn"), "Confirming skill purchase"),
            (assets_repository.get_button("learn_btn"), "Learning skill"),
            (assets_repository.get_button("close_btn"), "Closing skill window"),
        ]

        success = True
        for image_path, text in steps:
            if not self.interaction.click_element(image_path, text=text):
                success = False
                break
            sleep(0.5)

        return success

    def _go_back_from_skills(self) -> bool:
        """Go back from skills screen"""
        return self.interaction.click_element(
            "assets/buttons/back_btn.png", text="Going back from skills"
        )
