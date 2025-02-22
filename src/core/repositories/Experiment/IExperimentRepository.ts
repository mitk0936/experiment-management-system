import { IExperiment } from "../../entities/Experiment";

export interface IExperimentRepository {
  findByUserId(userId: string): Promise<IExperiment[]>;
  getById(experimentId: string): Promise<IExperiment | null>;
  create(experiment: IExperiment): Promise<IExperiment>;
  update(id: string, data: Partial<IExperiment>): Promise<IExperiment | null>;
  delete(id: string): Promise<boolean>;
}
