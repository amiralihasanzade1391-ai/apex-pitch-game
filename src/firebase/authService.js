import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';
import { saveUserProfile } from './userProfile';

const googleProvider = new GoogleAuthProvider();

/** Map Firebase Auth error codes to bilingual error message keys in strings.js */
export function getAuthErrorMessageKey(errorCode) {
  switch (errorCode) {
    case 'auth/operation-not-allowed':
      return 'authOpNotAllowed';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'authWrongPassword';
    case 'auth/user-not-found':
      return 'authUserNotFound';
    case 'auth/email-already-in-use':
      return 'authEmailInUse';
    case 'auth/weak-password':
      return 'authWeakPassword';
    case 'auth/invalid-email':
      return 'authInvalidEmail';
    case 'auth/popup-closed-by-user':
      return 'authPopupClosed';
    default:
      return 'authGenericError';
  }
}

/** Subscribe to Auth State Changes */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/** Sign in with Google Popup */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await saveUserProfile(user.uid, {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Manager',
        email: user.email,
        photoURL: user.photoURL || null,
        isAnonymous: false,
      });
    }
    return user;
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

/** Register with Email and Password */
export async function registerWithEmail(email, password, displayName) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = cred.user;
    const name = displayName?.trim() || email.split('@')[0] || 'Manager';
    
    try {
      await updateProfile(user, { displayName: name });
    } catch (profileErr) {
      console.warn('Could not update profile displayName:', profileErr);
    }

    await saveUserProfile(user.uid, {
      uid: user.uid,
      displayName: name,
      email: user.email,
      photoURL: null,
      isAnonymous: false,
    });

    return user;
  } catch (err) {
    console.error('Email Registration Error:', err);
    throw err;
  }
}

/** Sign in with Email and Password */
export async function loginWithEmail(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = cred.user;
    if (user) {
      await saveUserProfile(user.uid, {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0] || 'Manager',
        email: user.email,
        isAnonymous: false,
      });
    }
    return user;
  } catch (err) {
    console.error('Email Sign-In Error:', err);
    throw err;
  }
}

/** Continue as Guest (Anonymous Auth) */
export async function loginAsGuest() {
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.error('Guest Login Error:', err);
    throw err;
  }
}

/** Sign Out */
export async function logOut() {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign Out Error:', err);
    throw err;
  }
}
