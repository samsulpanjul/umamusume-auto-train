import { z } from "zod";


export type SupportCardType = {
  id: string;
  name: string;
  image_url: string;
  rarity: string;
  type: string;
};

export type HintType = {
  character_name: string,
  hint_names: string[],
}

export type HintData = {
  supportCardArraySchema: {
    supportCards: SupportCardType[];
  };
  hintArraySchema: {
    hints: HintType[];
  }
};


export const HintChoicesSchema = z.object({
  character_name: z.string(),
  hint_name: z.string(),
  priority: z.string()
});

export const HintSchema = z.object({
  hint_choices: z.array(HintChoicesSchema),
});

export type HintChoicesType = z.infer<typeof HintChoicesSchema>;
export type Hint = z.infer<typeof HintSchema>;
