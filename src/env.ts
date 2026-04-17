import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .optional()
    .default("")
    .transform((val) => val.trim())
    .pipe(
      z.union([
        z.literal(""),
        z.string().url("VITE_API_URL must be a valid URL"),
      ]),
    ),
});

export const env = envSchema.parse(import.meta.env);
