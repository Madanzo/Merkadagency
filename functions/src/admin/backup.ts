import { onSchedule } from "firebase-functions/v2/scheduler";
import * as firestore from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

/**
 * Scheduled function to back up Firestore to Google Cloud Storage.
 * Runs every day at midnight (00:00).
 *
 * Requirements:
 * 1. The default App Engine service account must have the 'Cloud Datastore Import Export Admin' role.
 * 2. The Cloud Storage bucket must exist (default bucket is usually fine).
 */
export const scheduledBackup = onSchedule({
    schedule: "every day 00:00",
    timeoutSeconds: 540, // Max allowed for gen2 HTTP/Scheduler triggers
    memory: "256MiB",
}, async (event) => {
    const client = new firestore.v1.FirestoreAdminClient();
    const projectId = process.env.GCLOUD_PROJECT || process.env.FIREBASE_CONFIG && JSON.parse(process.env.FIREBASE_CONFIG).projectId;

    if (!projectId) {
        logger.error("No project ID found");
        return;
    }

    const bucketName = `gs://${projectId}.appspot.com`; // Default Firebase Storage bucket
    const databaseName = client.databasePath(projectId, "(default)");

    try {
        const [response] = await client.exportDocuments({
            name: databaseName,
            outputUriPrefix: bucketName,
            // empty collectionIds exports all collections
            collectionIds: [],
        });

        logger.info(`Backup operation started: ${response.name}`);
    } catch (err) {
        logger.error("Export operation failed", err);
        throw new Error("Export operation failed");
    }
});
