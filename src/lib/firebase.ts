import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA80s6Mqqe4bqvgk3p5LvNLzbTc36ibbUg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zunayedsportfolio.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zunayedsportfolio",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zunayedsportfolio.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "813423899542",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:813423899542:web:36a1e2a183e94492f223b7",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C15QM43VFE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Gracefully and safely initialize analytics without crashing in restricted/sandboxed iframes
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        try {
          analytics = getAnalytics(app);
        } catch (err) {
          // Ignore if sandboxed environment disallows fetch patching or indexedDB
        }
      }
    })
    .catch(() => {
      // Ignore unsupported environments
    });
}
