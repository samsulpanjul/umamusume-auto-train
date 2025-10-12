export type Stat = {
  spd: number;
  sta: number;
  pwr: number;
  guts: number;
  wit: number;
};

export type Skill = {
  is_auto_buy_skill: boolean;
  skill_pts_check: number;
  skill_list: string[];
};

export type RaceScheduleType = {
  name: string;
  year: string;
  date: string;
};

export type Config = {
  config_name: string;
  priority_stat: string[];
  priority_weights: number[];
  sleep_time_multiplier: number;
  skip_training_energy: number;
  never_rest_energy: number;
  skip_infirmary_unless_missing_energy: number;
  priority_weight: string;
  minimum_mood: string;
  minimum_mood_junior_year: string;
  maximum_failure: number;
  prioritize_g1_race: boolean;
  cancel_consecutive_race: boolean;
  position_selection_enabled: boolean;
  enable_positions_by_race: boolean;
  preferred_position: string;
  positions_by_race: {
    sprint: string;
    mile: string;
    medium: string;
    long: string;
  };
  race_schedule: RaceScheduleType[];
  stat_caps: Stat;
  skill: Skill;
  window_name: string;
  mode: string;
};
