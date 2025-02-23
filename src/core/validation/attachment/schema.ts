import { z } from "zod";
import { MESSAGES } from "@/presentation/constants/messages";

export const attachmentSchema = z.object({
  file: z.instanceof(File).refine((file) => file.type === "text/csv", {
    message: MESSAGES.OnlyCsvFilesAreAllowed,
  }),
  experimentId: z.string().min(1, MESSAGES.ExperimentIdIsRequired),
});
