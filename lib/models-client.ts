import { z } from "zod";

/**
 * Client-safe utilities for AI model validation and form handling
 * Used by Add and Edit model dialogs (client components)
 */
export const modelSchema = z.object({
  provider_name: z.enum(["OpenAI", "Anthropic", "Google", "xAI"], {
    required_error: "Please select a provider",
  }),
  model_name: z
    .string()
    .min(1, "Model name is required")
    .max(100, "Model name too long"),
  has_image_input: z.boolean(),
  has_audio_input: z.boolean(),
  has_reasoning: z.boolean(),
});

export type ModelFormData = z.infer<typeof modelSchema>;

export const initialFormState: ModelFormData = {
  provider_name: "OpenAI",
  model_name: "",
  has_image_input: false,
  has_audio_input: false,
  has_reasoning: false,
};
