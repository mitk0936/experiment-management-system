import { IExperiment } from "../../entities/Experiment";

export interface IExperimentRepository {
  getById(experimentId: string): Promise<IExperiment | null>;
  create(experiment: IExperiment): Promise<IExperiment>;
  update(id: string, data: Partial<IExperiment>): Promise<IExperiment>;
  delete(id: string): Promise<void>;
}
