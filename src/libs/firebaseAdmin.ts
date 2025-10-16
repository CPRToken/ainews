/* eslint-disable import/no-extraneous-dependencies */

import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
  admin.initializeApp({
    credential: admin.credential.cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      privateKey: privateKey.replace(/\\n/g, '\n')
    }),
    // Ensure you use the correct storage bucket URL here
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-default-bucket-name'
  });
}

export default admin;
