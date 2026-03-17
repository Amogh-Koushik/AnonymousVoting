// ============================================================
// Firebase Admin SDK Configuration
// Initializes Firebase Admin for server-side token verification
// ============================================================

const admin = require('firebase-admin');

// Initialize Firebase Admin with service account credentials from env
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace escaped newlines in the private key string
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

module.exports = admin;
