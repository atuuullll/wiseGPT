import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'

// Add additional Firebase SDKs here as the app starts using them.
// Docs: https://firebase.google.com/docs/web/setup#available-libraries
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseVapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Analytics only works in supported browser environments.
export const analytics = isSupported().then((supported) => {
  if (!supported) {
    return null
  }

  return getAnalytics(app)
})
