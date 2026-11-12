import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyChQjKQDJLWkqpFGtIH-Nd8s3-ASfessyA",
  authDomain: "apex-pitch.firebaseapp.com",
  projectId: "apex-pitch",
  storageBucket: "apex-pitch.firebasestorage.app",
  messagingSenderId: "141796864848",
  appId: "1:141796864848:web:6b551030fcdbb66f68b255"
};

// Initialize or reuse Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with experimentalForceLongPolling for maximum reliability through proxies/ISPs
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

// Initialize Auth
export const auth = getAuth(app);

/**
 * Ensures the client is signed in anonymously.
 * Awaits authStateReady, validates current token if any, and signs in if needed.
 * Returns the authenticated user or throws with Firebase error code.
 */
export async function ensureAuth() {
  try {
    if (typeof auth.authStateReady === 'function') {
      await auth.authStateReady();
    }

    if (auth.currentUser) {
      try {
        await auth.currentUser.getIdToken(true);
        return auth.currentUser;
      } catch (tokenErr) {
        console.warn('Cached Firebase auth token expired or invalid, signing in fresh:', tokenErr);
      }
    }

    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.error('Firebase ensureAuth error:', err);
    throw err;
  }
}

export default { app, db, auth, ensureAuth };
