import { z } from "zod";

export const StatSchema = z.object({
  spd: z.number(),
  sta: z.number(),
  pwr: z.number(),
  guts: z.number(),
  wit: z.number(),
});

export type Stat = z.infer<typeof StatSchema>;
