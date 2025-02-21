import { IExperimentRepository } from "./IExperimentRepository";
import { CollectionReference } from "@google-cloud/firestore";
import { firestoreDb as db } from "@/core/db/index";
import { IExperiment } from "@/core/entities/Experiment";

export class FirestoreExperimentRepository implements IExperimentRepository {
  private collection = db.collection("experiments") as CollectionReference<IExperiment>;

  async findByUserId(userId: string): Promise<IExperiment[]> {
    const snapshot = await this.collection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as IExperiment);
  }

  async create(experiment: IExperiment): Promise<IExperiment> {
    const docRef = await this.collection.add(experiment);
    return { id: docRef.id, ...experiment };
  }

  async update(id: string, data: Partial<IExperiment>): Promise<IExperiment | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    await docRef.update(data);
    return { id, ...doc.data(), ...data } as IExperiment;
  }

  async delete(id: string): Promise<boolean> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;

    await docRef.delete();
    return true;
  }

  async getAll(): Promise<IExperiment[]> {
    const snapshot = await this.collection.orderBy("dateCreated", "desc").get();
    const experiments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return experiments;
  }
}
