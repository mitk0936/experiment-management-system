import { IAttachmentRepository } from "./IAttachmentRepository";
import { Attachment } from "@/core/entities/Attachment";
import { firestoreDb as db } from "@/core/db/index";
import { CollectionReference } from "@google-cloud/firestore";
import { IAttachment } from "@/core/types/entities";

export class FirestoreAttachmentRepository implements IAttachmentRepository {
  private attachmentsCollection = db.collection("attachments") as CollectionReference<IAttachment>;

  async create(attachment: Attachment): Promise<Attachment> {
    await this.attachmentsCollection.doc(attachment.id).set(attachment.toDto());
    return attachment;
  }

  async getById(attachmentId: string): Promise<Attachment | null> {
    const doc = await this.attachmentsCollection.doc(attachmentId).get();

    if (!doc.exists) {
      return null;
    }

    return new Attachment(doc.data() as IAttachment);
  }

  async getByExperimentId(experimentId: string): Promise<Attachment[]> {
    const snapshot = await this.attachmentsCollection
      .where("experimentId", "==", experimentId)
      .get();

    return snapshot.docs.map((doc) => new Attachment(doc.data() as IAttachment));
  }

  async delete(id: string): Promise<void> {
    await this.attachmentsCollection.doc(id).delete();
  }

  async deleteByExperimentId(experimentId: string): Promise<void> {
    const snapshot = await this.attachmentsCollection
      .where("experimentId", "==", experimentId)
      .get();

    if (snapshot.empty) {
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));

    await batch.commit();
  }
}

export const attachmentsRepository = new FirestoreAttachmentRepository();
