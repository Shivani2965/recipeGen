import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import localConfig from "../../firebase-applet-config.json";

const firebaseConfig = {
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || localConfig.projectId,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || localConfig.appId,
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || localConfig.apiKey,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain,
  firestoreDatabaseId: import.meta.env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID || localConfig.firestoreDatabaseId,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId,
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || localConfig.firestoreDatabaseId);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Validate connection to Firestore on boot as per standard guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Please check your Firebase configuration: client is offline.");
    }
  }
}

if (typeof window !== "undefined") {
  testConnection();
}

export {
  app,
  auth,
  db,
  googleProvider,
  firebaseConfig
};


