import { Firestore } from "@google-cloud/firestore";

export const firestoreDb = new Firestore({ projectId: "experiments-management-app" });
