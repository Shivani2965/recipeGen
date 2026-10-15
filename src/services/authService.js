import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "./firebase.js";
import { createUserProfile, updateUserProfile } from "./firestoreService.js";

/**
 * Normalizes Firebase auth errors into friendly human messages
 */
export function formatAuthError(err) {
  if (!err) return "An unknown error occurred.";
  const code = err.code || "";
  switch (code) {
    case "auth/operation-not-allowed":
      return "Email & password sign-in is not enabled in this Firebase project. Please use 1-click Google Sign-In or Continue as Guest.";
    case "auth/admin-restricted-operation":
      return "Anonymous authentication is restricted. Using Demo Guest session.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password. Please verify your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in instead.";
    case "auth/popup-closed-by-user":
      return "Google Sign-In was cancelled before completion.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by browser. Please allow popups for this site.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return err.message || "Authentication failed. Please try again.";
  }
}

/**
 * Sign in existing user with email and password
 */
export async function loginWithEmail(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  } catch (err) {
    const friendly = new Error(formatAuthError(err));
    friendly.code = err.code;
    throw friendly;
  }
}

/**
 * Register a new user with name, email and password
 */
export async function registerWithEmail(name, email, password) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    if (name) {
      try {
        await updateProfile(user, { displayName: name });
      } catch (e) {
        console.warn("Could not update auth display name:", e);
      }
    }

    try {
      await createUserProfile(user.uid, {
        name: name || "Chef",
        email: user.email || email,
        photoURL: user.photoURL || ""
      });
    } catch (e) {
      console.warn("Could not create initial user profile doc:", e);
    }

    return user;
  } catch (err) {
    const friendly = new Error(formatAuthError(err));
    friendly.code = err.code;
    throw friendly;
  }
}

/**
 * Sign in or sign up with Google popup (Primary method provisioned for AI Studio)
 */
export async function loginWithGoogle() {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const user = credential.user;

    try {
      await createUserProfile(user.uid, {
        name: user.displayName || "Google Chef",
        email: user.email || "",
        photoURL: user.photoURL || ""
      });
    } catch (e) {
      console.warn("Could not sync Google user profile doc:", e);
    }

    return user;
  } catch (err) {
    const friendly = new Error(formatAuthError(err));
    friendly.code = err.code;
    throw friendly;
  }
}

/**
 * Sign in as demo guest (attempts Firebase Anonymous auth; gracefully falls back to local guest session)
 */
export async function loginAsGuestDemo() {
  try {
    const credential = await signInAnonymously(auth);
    const user = credential.user;

    try {
      await createUserProfile(user.uid, {
        name: "Guest Chef",
        email: "guest@smartrecipe.demo",
        photoURL: ""
      });
    } catch (e) {
      console.warn("Could not set guest user profile doc:", e);
    }

    return user;
  } catch (err) {
    // If anonymous auth is disabled or restricted in Firebase console, provide local guest session
    console.info("Firebase anonymous auth not available, activating local Demo Guest session.");
    let localId = "guest_chef";
    if (typeof window !== "undefined") {
      localId = localStorage.getItem("smartrecipe_guest_id") || ("guest_" + Math.random().toString(36).substring(2, 9));
      localStorage.setItem("smartrecipe_guest_id", localId);
    }
    const guestUser = {
      uid: localId,
      displayName: "Guest Chef",
      email: "guest@smartrecipe.demo",
      photoURL: "",
      isAnonymous: true,
      isLocalGuest: true
    };
    return guestUser;
  }
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn("Firebase sign out warning:", err);
  }
}

/**
 * Update current user's display name
 */
export async function updateUserDisplayName(name) {
  const user = auth.currentUser;
  if (!user) {
    return;
  }

  try {
    await updateProfile(user, { displayName: name });
  } catch (e) {
    console.warn("Could not update auth profile:", e);
  }

  try {
    await updateUserProfile(user.uid, { name });
  } catch (e) {
    console.warn("Could not update name in Firestore:", e);
  }
}

export default {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAsGuestDemo,
  logoutUser,
  updateUserDisplayName,
  formatAuthError
};
