import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase.ts';
import { createOrUpdateUserProfile } from './firestoreService.ts';

export async function loginWithEmail(email: string, password: string):Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set display name in Firebase Auth
  await updateProfile(user, {
    displayName: name,
  });

  // Store profile in Firestore
  await createOrUpdateUserProfile(user.uid, {
    name,
    email,
    userId: user.uid,
  });

  return user;
}

export async function loginWithGoogle(): Promise<User> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  await createOrUpdateUserProfile(user.uid, {
    name: user.displayName || 'Google User',
    email: user.email || '',
    photoURL: user.photoURL || '',
    userId: user.uid,
  });

  return user;
}

export async function loginAsGuestDemo(): Promise<User> {
  const userCredential = await signInAnonymously(auth);
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: 'Demo Foodie',
  });

  await createOrUpdateUserProfile(user.uid, {
    name: 'Demo Foodie',
    email: 'demo@smartrecipe.app',
    userId: user.uid,
  });

  return user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function updateUserDisplayName(name: string, photoURL?: string): Promise<void> {
  if (!auth.currentUser) throw new Error('No user is currently signed in.');
  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: photoURL || auth.currentUser.photoURL,
  });
  await createOrUpdateUserProfile(auth.currentUser.uid, {
    name,
    photoURL: photoURL || auth.currentUser.photoURL || undefined,
  });
}
