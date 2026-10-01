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
 * Sign in existing user with email and password
 */
export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Register a new user with name, email and password
 */
export async function registerWithEmail(name, email, password) {
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
}

/**
 * Sign in or sign up with Google popup
 */
export async function loginWithGoogle() {
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
}

/**
 * Sign in anonymously for a quick demo / guest experience
 */
export async function loginAsGuestDemo() {
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
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Update current user's display name
 */
export async function updateUserDisplayName(name) {
  const user = auth.currentUser;
  if (!user) throw new Error("No active user session");

  await updateProfile(user, { displayName: name });

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
  updateUserDisplayName
};
