import { IExperimentRepository } from "./IExperimentRepository";
import { CollectionReference } from "@google-cloud/firestore";
import { firestoreDb as db } from "@/core/db/index";
import { Experiment } from "@/core/entities/Experiment";
import { IExperiment } from "@/core/types/entities";

export class FirestoreExperimentRepository implements IExperimentRepository {
  private collection = db.collection("experiments") as CollectionReference<IExperiment>;

  async getById(experimentId: string): Promise<IExperiment | null> {
    const snapshot = await this.collection.where("id", "==", experimentId).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0].data();

    return new Experiment({ ...data });
  }

  async create(experiment: IExperiment): Promise<IExperiment> {
    await this.collection.add(experiment);
    return experiment;
  }

  async update(id: string, data: Partial<IExperiment>): Promise<IExperiment> {
    const snapshot = await this.collection.where("id", "==", id).limit(1).get();

    if (snapshot.empty) {
      throw new Error("Experiment does not exist.");
    }

    const experimentItem = snapshot.docs[0];
    await experimentItem.ref.update(data);
    const updatedDoc = await experimentItem.ref.get();
    return updatedDoc.data() as IExperiment;
  }

  async delete(id: string): Promise<void> {
    const snapshot = await this.collection.where("id", "==", id).get();
    const item = snapshot.docs[0];

    if (!item) {
      throw new Error("No experiment to delete.");
    }

    await item.ref.delete();
  }

  async getAll(): Promise<IExperiment[]> {
    const snapshot = await this.collection.orderBy("dateCreated", "desc").get();
    const experiments = snapshot.docs.map((doc) => ({ ...doc.data() }));
    return experiments;
  }
}
