import { randomUUID } from "crypto";

export interface IAttachmentMetaData {
  id: string;
  experimentId: string;
  filename: string;
  mimeType: string;
  dateUploaded: string;
}

export interface IAttachment extends IAttachmentMetaData {
  fileData: string;
}

export class Attachment implements IAttachment {
  id: string;
  experimentId: string;
  filename: string;
  mimeType: string;
  fileData: string;
  dateUploaded: string;

  constructor(data: IAttachment) {
    this.id = data.id;
    this.experimentId = data.experimentId;
    this.filename = data.filename;
    this.mimeType = data.mimeType;
    this.fileData = data.fileData;
    this.dateUploaded = data.dateUploaded;
  }

  static generateAttachmentId(): string {
    return `att_${randomUUID()}`;
  }

  toMetaDataDto(): IAttachmentMetaData {
    return {
      id: this.id,
      experimentId: this.experimentId,
      filename: this.filename,
      mimeType: this.mimeType,
      dateUploaded: this.dateUploaded,
    };
  }

  toDto(): IAttachment {
    return {
      id: this.id,
      experimentId: this.experimentId,
      filename: this.filename,
      mimeType: this.mimeType,
      fileData: this.fileData,
      dateUploaded: this.dateUploaded,
    };
  }
}
