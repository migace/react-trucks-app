import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url("VITE_API_URL must be a valid URL"),
  VITE_OPENAI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);
