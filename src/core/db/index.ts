import { Firestore } from "@google-cloud/firestore";

// The current setup supports only local firestore, emulator.
// There should be a separate instantion for production env
export const firestoreDb = new Firestore({ projectId: "experiments-management-app" });
