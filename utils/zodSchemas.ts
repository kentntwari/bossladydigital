import { z } from "zod";

export const zodProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.object({
    id: z.string(),
    amount: z.number(),
  }),
  currency: z.string(),
  url: z.string(),
});
