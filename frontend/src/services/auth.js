import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'That email is already in use.',
  'auth/invalid-credential': 'The email or password is incorrect.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Enter your password to continue.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/weak-password': 'Use a stronger password with at least 6 characters.',
}

export function formatAuthError(error) {
  return AUTH_ERROR_MESSAGES[error?.code] || 'Authentication failed. Please try again.'
}

export async function signUpWithEmail({ name, email, password }) {
  const credentials = await createUserWithEmailAndPassword(auth, email, password)

  if (name?.trim()) {
    await updateProfile(credentials.user, {
      displayName: name.trim(),
    })
  }

  return credentials.user
}

export async function signInWithEmail({ email, password }) {
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  return credentials.user
}

export function signOutUser() {
  return signOut(auth)
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}
