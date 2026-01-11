import { z } from "zod";

export type SkillData = {
  name: string;
  description: string;
};

export const SkillSchema = z.object({
  is_auto_buy_skill: z.boolean(),
  skill_pts_check: z.number(),
  skill_list: z.array(z.string()),
});

export type Skill = z.infer<typeof SkillSchema>;
