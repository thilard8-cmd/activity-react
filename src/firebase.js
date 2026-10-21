import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key.replace(/([A-Z])/g, '_$1').toUpperCase())

if (missingConfig.length) {
  const message =
    `Firebase config is incomplete. Missing env vars: ` +
    missingConfig.map((k) => `VITE_FIREBASE_${k}`).join(', ')

  console.error(message)

  // Fail loudly with a readable screen instead of a blank page.
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="padding:2rem;font:14px/1.6 ui-monospace,monospace;color:#111">
        <h1 style="font-size:1.1rem;margin:0 0 .5rem">Firebase is not configured</h1>
        <p style="margin:0 0 .75rem">${message}</p>
        <p style="margin:0">Set these in Netlify → Environment variables, then run
        “Clear cache and deploy site”.</p>
      </div>`
  }

  throw new Error(message)
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export default app