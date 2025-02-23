import { z } from "zod";
import { MESSAGES } from "@/presentation/constants/messages";
import { ExperimentField, ExperimentStatus } from "@/core/types/entities";

export const experimentSchema = z.object({
  name: z.string().trim().min(3, { message: MESSAGES.NameMustBe3OrMoreChars }),
  description: z.string().trim().optional(),
  field: z.nativeEnum(ExperimentField, {
    message: MESSAGES.FieldIsRequired,
  }),
  status: z.nativeEnum(ExperimentStatus, {
    message: MESSAGES.StatusIsRequried,
  }),
});

export type ExperimentFormData = z.infer<typeof experimentSchema>;
