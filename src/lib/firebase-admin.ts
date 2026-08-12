import * as admin from 'firebase-admin';

// Ensure the app is only initialized once
if (!admin.apps.length) {
  // When deployed to App Hosting, GOOGLE_APPLICATION_CREDENTIALS is automatically set
  // and the SDK will automatically use the correct project credentials.
  // For local development, you need to set this environment variable yourself.
  admin.initializeApp();
}

export const db = admin.firestore();
