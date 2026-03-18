// ============================================================
// Firebase Admin SDK Configuration
// Initializes Firebase Admin for server-side token verification
// ============================================================

const admin = require('firebase-admin');

try {
  // Handle private key — Render may store it with literal \n or actual newlines
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Remove surrounding quotes if present
    privateKey = privateKey.replace(/^["']|["']$/g, '');
    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('⚠️ Firebase Admin initialization failed:', error.message);
  console.error('Auth features will not work until Firebase is properly configured.');
}

module.exports = admin;
