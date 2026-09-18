import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Recursively cleans any object/array before writing to Firestore,
 * purging all undefined values so setDoc/updateDoc never fails.
 */
export function cleanFirestoreData<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date) {
    return data.toISOString() as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as any;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanObj[key] = typeof value === 'object' && value !== null ? cleanFirestoreData(value) : value;
    }
  }
  return cleanObj as any;
}

// User Profile
export interface UserProfileData {
  userId: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt?: any;
}

export async function createOrUpdateUserProfile(
  userId: string,
  data: Partial<UserProfileData>
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      await setDoc(userDocRef, cleanFirestoreData({
        userId,
        name: data.name || 'Chef',
        email: data.email || '',
        photoURL: data.photoURL || '',
        createdAt: new Date().toISOString(),
      }));
    } else {
      await setDoc(
        userDocRef,
        cleanFirestoreData({
          ...existing.data(),
          ...data,
          userId,
        }),
        { merge: true }
      );
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const path = `users/${userId}`;
  try {
    const snapshot = await getDoc(doc(db, 'users', userId));
    if (snapshot.exists()) {
      return snapshot.data() as UserProfileData;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

// Saved Recipes
export interface SavedRecipeItem {
  id?: string;
  userId: string;
  recipeId: string;
  title: string;
  image?: string;
  summary?: string;
  ingredients?: any[];
  instructions?: any;
  savedAt?: string;
}

export async function saveRecipe(userId: string, recipe: any): Promise<string> {
  const path = 'savedRecipes';
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = `${userId}_${recipeId}`;

  try {
    const docRef = doc(db, 'savedRecipes', docId);
    await setDoc(docRef, cleanFirestoreData({
      userId,
      recipeId,
      title: recipe.title || 'Untitled Recipe',
      image: recipe.image || '',
      summary: recipe.summary || '',
      ingredients: recipe.extendedIngredients || recipe.ingredients || [],
      instructions: recipe.analyzedInstructions || recipe.instructions || '',
      savedAt: new Date().toISOString(),
    }));
    return docId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function removeSavedRecipe(userId: string, recipeId: string | number): Promise<void> {
  const docId = `${userId}_${recipeId}`;
  const path = `savedRecipes/${docId}`;
  try {
    await deleteDoc(doc(db, 'savedRecipes', docId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function getSavedRecipes(userId: string): Promise<SavedRecipeItem[]> {
  const path = 'savedRecipes';
  try {
    const q = query(collection(db, 'savedRecipes'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items: SavedRecipeItem[] = [];
    querySnapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as SavedRecipeItem) });
    });
    return items.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function isRecipeSaved(userId: string, recipeId: string | number): Promise<boolean> {
  const docId = `${userId}_${recipeId}`;
  const path = `savedRecipes/${docId}`;
  try {
    const docSnap = await getDoc(doc(db, 'savedRecipes', docId));
    return docSnap.exists();
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return false;
  }
}

// Favorites
export interface FavoriteItem {
  id?: string;
  userId: string;
  recipeId: string;
  title: string;
  image?: string;
  addedAt?: string;
}

export async function addFavorite(userId: string, recipe: any): Promise<string> {
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = `${userId}_${recipeId}`;
  const path = `favorites/${docId}`;

  try {
    const docRef = doc(db, 'favorites', docId);
    await setDoc(docRef, cleanFirestoreData({
      userId,
      recipeId,
      title: recipe.title || 'Untitled Recipe',
      image: recipe.image || '',
      addedAt: new Date().toISOString(),
    }));
    return docId;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function removeFavorite(userId: string, recipeId: string | number): Promise<void> {
  const docId = `${userId}_${recipeId}`;
  const path = `favorites/${docId}`;
  try {
    await deleteDoc(doc(db, 'favorites', docId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function getFavorites(userId: string): Promise<FavoriteItem[]> {
  const path = 'favorites';
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items: FavoriteItem[] = [];
    querySnapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as FavoriteItem) });
    });
    return items.sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function isRecipeFavorite(userId: string, recipeId: string | number): Promise<boolean> {
  const docId = `${userId}_${recipeId}`;
  const path = `favorites/${docId}`;
  try {
    const docSnap = await getDoc(doc(db, 'favorites', docId));
    return docSnap.exists();
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return false;
  }
}

// Search History
export interface SearchHistoryItem {
  id?: string;
  userId: string;
  ingredients?: string[];
  filters?: Record<string, any>;
  query?: string;
  searchedAt?: string;
}

export async function addSearchHistory(
  userId: string,
  ingredients: string[],
  filters?: Record<string, any>,
  searchQuery?: string
): Promise<void> {
  const path = 'searchHistory';
  try {
    const cleanIngredients = (ingredients || []).map((i) => i.trim().toLowerCase());
    const docId = `${userId}_${Date.now()}`;
    await setDoc(doc(db, 'searchHistory', docId), cleanFirestoreData({
      userId,
      ingredients: cleanIngredients,
      filters: filters || {},
      query: searchQuery || cleanIngredients.join(', '),
      searchedAt: new Date().toISOString(),
    }));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getSearchHistory(userId: string): Promise<SearchHistoryItem[]> {
  const path = 'searchHistory';
  try {
    const q = query(collection(db, 'searchHistory'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items: SearchHistoryItem[] = [];
    querySnapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as SearchHistoryItem) });
    });
    return items
      .sort((a, b) => (b.searchedAt || '').localeCompare(a.searchedAt || ''))
      .slice(0, 15);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function clearSearchHistory(userId: string): Promise<void> {
  const path = 'searchHistory';
  try {
    const q = query(collection(db, 'searchHistory'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const deletePromises: Promise<void>[] = [];
    querySnapshot.forEach((d) => {
      deletePromises.push(deleteDoc(d.ref));
    });
    await Promise.all(deletePromises);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Recently Viewed
export interface RecentlyViewedItem {
  id?: string;
  userId: string;
  recipeId: string;
  title: string;
  image?: string;
  viewedAt?: string;
}

export async function addRecentlyViewed(userId: string, recipe: any): Promise<void> {
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = `${userId}_${recipeId}`;
  const path = `recentlyViewed/${docId}`;

  try {
    await setDoc(doc(db, 'recentlyViewed', docId), cleanFirestoreData({
      userId,
      recipeId,
      title: recipe.title || 'Untitled Recipe',
      image: recipe.image || '',
      viewedAt: new Date().toISOString(),
    }));
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getRecentlyViewed(userId: string): Promise<RecentlyViewedItem[]> {
  const path = 'recentlyViewed';
  try {
    const q = query(collection(db, 'recentlyViewed'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items: RecentlyViewedItem[] = [];
    querySnapshot.forEach((d) => {
      items.push({ id: d.id, ...(d.data() as RecentlyViewedItem) });
    });
    return items
      .sort((a, b) => (b.viewedAt || '').localeCompare(a.viewedAt || ''))
      .slice(0, 12);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}
