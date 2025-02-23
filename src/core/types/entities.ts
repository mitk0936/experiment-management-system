/** Attachment Interfaces */
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

/** Experiment Interfaces and types */
export interface IExperiment {
  id: string;
  name: string;
  description?: string;
  field: ExperimentField;
  status: ExperimentStatus;
  userId: string; // ID of the user who published the experiment
  dateCreated: string;
}

export enum ExperimentField {
  Physics = "Physics",
  Chemistry = "Chemistry",
  Biology = "Biology",
  Engineering = "Engineering",
}

export enum ExperimentStatus {
  Pending = "Pending",
  Ongoing = "Ongoing",
  Completed = "Completed",
}

/** User Interface */
export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
}
