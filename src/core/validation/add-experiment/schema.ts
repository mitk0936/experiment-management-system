import { z } from "zod";
import { ExperimentField, ExperimentStatus } from "@/core/entities/Experiment";
import { MESSAGES } from "@/presentation/constants/messages";

export const addExperimentSchema = z.object({
  name: z.string().trim().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  field: z.nativeEnum(ExperimentField, {
    message: MESSAGES.FieldIsRequired,
  }),
  status: z.nativeEnum(ExperimentStatus, {
    message: MESSAGES.StatusIsRequried,
  }),
});

export type AddExperimentFormData = z.infer<typeof addExperimentSchema>;
