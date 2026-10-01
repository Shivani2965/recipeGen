import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  addDoc
} from "firebase/firestore";
import { db } from "./firebase.js";

/**
 * Normalizes document IDs to only alphanumeric and dashes
 */
function sanitizeDocId(userId, recipeId) {
  return `${userId}_${String(recipeId).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

// ----------------------------------------------------
// User Profile
// ----------------------------------------------------

export async function getUserProfile(userId) {
  if (!userId) return null;
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

export async function createUserProfile(userId, profileData = {}) {
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  const record = {
    userId,
    name: (profileData.name || "Chef").slice(0, 120),
    email: (profileData.email || "").slice(0, 255),
    photoURL: profileData.photoURL ? String(profileData.photoURL).slice(0, 1024) : "",
    createdAt: new Date().toISOString()
  };
  await setDoc(userRef, record, { merge: true });
  return record;
}

export async function updateUserProfile(userId, profileData = {}) {
  if (!userId) return;
  const userRef = doc(db, "users", userId);
  const updatePayload = {
    userId,
    ...(profileData.name ? { name: String(profileData.name).slice(0, 120) } : {}),
    ...(profileData.email ? { email: String(profileData.email).slice(0, 255) } : {}),
    ...(profileData.photoURL !== undefined ? { photoURL: String(profileData.photoURL).slice(0, 1024) } : {})
  };
  await setDoc(userRef, updatePayload, { merge: true });
}

// ----------------------------------------------------
// Favorites
// ----------------------------------------------------

export async function getFavorites(userId) {
  if (!userId) return [];
  try {
    const q = query(collection(db, "favorites"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((docItem) => {
      items.push({ id: docItem.id, ...docItem.data() });
    });
    // Sort descending by addedAt
    items.sort((a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime());
    return items;
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return [];
  }
}

export async function addFavorite(userId, recipe) {
  if (!userId || !recipe) return;
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = sanitizeDocId(userId, recipeId);
  const favDoc = doc(db, "favorites", docId);

  const payload = {
    userId,
    recipeId,
    title: (recipe.title || "Untitled Recipe").slice(0, 256),
    image: recipe.image ? String(recipe.image).slice(0, 1024) : "",
    readyInMinutes: Number(recipe.readyInMinutes) || 0,
    healthScore: Number(recipe.healthScore || recipe.spoonacularScore) || 0,
    addedAt: new Date().toISOString()
  };

  await setDoc(favDoc, payload, { merge: true });
  return payload;
}

export async function removeFavorite(userId, recipeId) {
  if (!userId || !recipeId) return;
  const docId = sanitizeDocId(userId, recipeId);
  await deleteDoc(doc(db, "favorites", docId));
}

// ----------------------------------------------------
// Saved Recipes (Bookmarks)
// ----------------------------------------------------

export async function getSavedRecipes(userId) {
  if (!userId) return [];
  try {
    const q = query(collection(db, "savedRecipes"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((docItem) => {
      items.push({ id: docItem.id, ...docItem.data() });
    });
    items.sort((a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime());
    return items;
  } catch (err) {
    console.error("Error fetching saved recipes:", err);
    return [];
  }
}

export async function saveRecipe(userId, recipe) {
  if (!userId || !recipe) return;
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = sanitizeDocId(userId, recipeId);
  const savedDoc = doc(db, "savedRecipes", docId);

  const payload = {
    userId,
    recipeId,
    title: (recipe.title || "Untitled Recipe").slice(0, 256),
    image: recipe.image ? String(recipe.image).slice(0, 1024) : "",
    summary: recipe.summary ? String(recipe.summary).slice(0, 4000) : "",
    readyInMinutes: Number(recipe.readyInMinutes) || 0,
    savedAt: new Date().toISOString()
  };

  await setDoc(savedDoc, payload, { merge: true });
  return payload;
}

export async function removeSavedRecipe(userId, recipeId) {
  if (!userId || !recipeId) return;
  const docId = sanitizeDocId(userId, recipeId);
  await deleteDoc(doc(db, "savedRecipes", docId));
}

// ----------------------------------------------------
// Search History
// ----------------------------------------------------

export async function addSearchHistory(userId, ingredients = [], filters = {}, queryText = "") {
  if (!userId) return;
  try {
    await addDoc(collection(db, "searchHistory"), {
      userId,
      query: (queryText || (Array.isArray(ingredients) ? ingredients.join(", ") : "")).slice(0, 256),
      ingredients: Array.isArray(ingredients) ? ingredients.slice(0, 20) : [],
      filters: filters || {},
      searchedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn("Could not write search history:", err);
  }
}

export async function getSearchHistory(userId, limitCount = 10) {
  if (!userId) return [];
  try {
    const q = query(collection(db, "searchHistory"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((docItem) => {
      items.push({ id: docItem.id, ...docItem.data() });
    });
    items.sort((a, b) => new Date(b.searchedAt || 0).getTime() - new Date(a.searchedAt || 0).getTime());
    return items.slice(0, limitCount);
  } catch (err) {
    console.error("Error reading search history:", err);
    return [];
  }
}

export async function clearSearchHistory(userId) {
  if (!userId) return;
  try {
    const q = query(collection(db, "searchHistory"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const deletes = [];
    snap.forEach((docItem) => {
      deletes.push(deleteDoc(doc(db, "searchHistory", docItem.id)));
    });
    await Promise.all(deletes);
  } catch (err) {
    console.error("Error clearing search history:", err);
    throw err;
  }
}

// ----------------------------------------------------
// Recently Viewed
// ----------------------------------------------------

export async function addRecentlyViewed(userId, recipe) {
  if (!userId || !recipe) return;
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = sanitizeDocId(userId, recipeId);
  const viewDoc = doc(db, "recentlyViewed", docId);

  const payload = {
    userId,
    recipeId,
    title: (recipe.title || "Untitled Recipe").slice(0, 256),
    image: recipe.image ? String(recipe.image).slice(0, 1024) : "",
    readyInMinutes: Number(recipe.readyInMinutes) || 0,
    healthScore: Number(recipe.healthScore || recipe.spoonacularScore) || 0,
    viewedAt: new Date().toISOString()
  };

  await setDoc(viewDoc, payload, { merge: true });
}

export async function getRecentlyViewed(userId, limitCount = 8) {
  if (!userId) return [];
  try {
    const q = query(collection(db, "recentlyViewed"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((docItem) => {
      items.push({ id: docItem.id, ...docItem.data() });
    });
    items.sort((a, b) => new Date(b.viewedAt || 0).getTime() - new Date(a.viewedAt || 0).getTime());
    return items.slice(0, limitCount);
  } catch (err) {
    console.error("Error fetching recently viewed:", err);
    return [];
  }
}

export default {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getFavorites,
  addFavorite,
  removeFavorite,
  getSavedRecipes,
  saveRecipe,
  removeSavedRecipe,
  addSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  addRecentlyViewed,
  getRecentlyViewed
};
