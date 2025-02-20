import { IUserRepository } from "./IUserRepository";
import { IUser, User } from "@/core/entities/User";
import { firestoreDb as db } from "@/core/db/index";
import { CollectionReference } from "@google-cloud/firestore";

export class FirestoreUserRepository implements IUserRepository {
  private usersCollection = db.collection("users") as CollectionReference<IUser>;

  async createUser(user: User): Promise<User> {
    await this.usersCollection.add({
      ...user.toDto(),
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const snapshot = await this.usersCollection.where("email", "==", email).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const data = snapshot.docs[0].data();

    return new User({ ...data });
  }
}
