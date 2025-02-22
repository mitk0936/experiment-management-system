import { randomUUID } from "node:crypto";

export interface IExperiment {
  id: string;
  name: string;
  description?: string;
  field: ExperimentField;
  status: ExperimentStatus;
  userId: string; // ID of the user who published the experiment
  dateCreated: string;
}

export class Experiment implements IExperiment {
  id: string;
  name: string;
  description?: string;
  field: ExperimentField;
  status: ExperimentStatus;
  userId: string;
  dateCreated: string;

  constructor(data: IExperiment) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.field = data.field;
    this.status = data.status;
    this.userId = data.userId;
    this.dateCreated = data.dateCreated;
  }

  static generateExperimentId(): string {
    return `exp_${randomUUID()}`;
  }

  toDto(): IExperiment {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      field: this.field,
      status: this.status,
      userId: this.userId,
      dateCreated: this.dateCreated,
    };
  }
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
