import { IAttachmentMetaData } from "@/core/entities/Attachment";
import { IExperiment } from "@/core/entities/Experiment";

export type ExperimentsMutationContext = { previousData: IExperiment[] | undefined };

export type AttachmentsMutationContext = { previousData: IAttachmentMetaData[] | undefined };
