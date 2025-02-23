import { z } from "zod";
import { MESSAGES } from "@/presentation/constants/messages";

export const attachmentSchema = z.object({
  file: z.instanceof(Buffer),
  experimentId: z.string().min(1, MESSAGES.ExperimentIdIsRequired),
});
