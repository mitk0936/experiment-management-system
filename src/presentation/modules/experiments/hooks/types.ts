import { IAttachmentMetaData, IExperiment } from "@/core/types/entities";

export type ExperimentsMutationContext = { previousData: IExperiment[] | undefined };

export type AttachmentsMutationContext = { previousData: IAttachmentMetaData[] | undefined };
