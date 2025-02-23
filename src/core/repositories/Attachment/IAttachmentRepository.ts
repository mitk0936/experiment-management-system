import { IAttachment } from "@/core/types/entities";

export interface IAttachmentRepository {
  getById(attachmentId: string): Promise<IAttachment | null>;
  getByExperimentId(experimentId: string): Promise<IAttachment[]>;
  create(attachment: IAttachment): Promise<IAttachment>;
  delete(id: string): Promise<void>;
  deleteByExperimentId(experimentId: string): Promise<void>;
}
