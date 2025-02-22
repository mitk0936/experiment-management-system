import ExperimentRepository from "../repositories/Experiment/ExperimentRepository";
import { UserRepository } from "../repositories/User/UserRepository";
import { logError } from "../utils/logger";

export class AccessControlService {
  static async isUserAuthorizedForExperiment(
    userId: string,
    experimentId: string,
  ): Promise<boolean> {
    try {
      const experiment = await ExperimentRepository.getById(experimentId);

      // Handle case with missing user or experiment data
      if (!experiment) {
        return false;
      }

      return Boolean(experiment.userId === userId);
    } catch (error) {
      logError(
        "Unable to check user access to experiment",
        error,
        "AccessControlService (isUserAuthorizedForExperiment)",
      );

      return false;
    }
  }
}
