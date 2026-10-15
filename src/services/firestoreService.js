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
import { db, auth } from "./firebase.js";

export const OperationType = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  LIST: "list",
  GET: "get",
  WRITE: "write",
};

/**
 * Standardized Firestore error handler adhering to skill guidelines
 */
export function handleFirestoreError(error, operationType, path) {
  const errMessage = error instanceof Error ? error.message : String(error);
  const errCode = error?.code || "";

  const errInfo = {
    error: errMessage,
    code: errCode,
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
  };

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  if (errCode === "permission-denied" || errMessage.toLowerCase().includes("permission")) {
    throw new Error(JSON.stringify(errInfo));
  }
  throw error;
}

/**
 * Normalizes document IDs to only alphanumeric and dashes
 */
function sanitizeDocId(userId, recipeId) {
  return `${userId}_${String(recipeId).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
}

function isGuestUser(userId) {
  return !auth.currentUser || (userId && String(userId).startsWith("guest_"));
}

// ----------------------------------------------------
// User Profile
// ----------------------------------------------------

export async function getUserProfile(userId) {
  if (!userId) return null;
  if (isGuestUser(userId)) {
    return {
      userId,
      name: "Guest Chef",
      email: "guest@smartrecipe.demo",
      photoURL: "",
      createdAt: new Date().toISOString()
    };
  }
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createUserProfile(userId, profileData = {}) {
  if (!userId) return null;
  if (isGuestUser(userId)) {
    return {
      userId,
      name: (profileData.name || "Guest Chef").slice(0, 120),
      email: (profileData.email || "guest@smartrecipe.demo").slice(0, 255),
      photoURL: "",
      createdAt: new Date().toISOString()
    };
  }
  const path = `users/${userId}`;
  try {
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
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return null;
  }
}

export async function updateUserProfile(userId, profileData = {}) {
  if (!userId) return;
  if (isGuestUser(userId)) return;
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, "users", userId);
    const updatePayload = {
      userId,
      ...(profileData.name ? { name: String(profileData.name).slice(0, 120) } : {}),
      ...(profileData.email ? { email: String(profileData.email).slice(0, 255) } : {}),
      ...(profileData.photoURL !== undefined ? { photoURL: String(profileData.photoURL).slice(0, 1024) } : {})
    };
    await setDoc(userRef, updatePayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ----------------------------------------------------
// Favorites
// ----------------------------------------------------

export async function getFavorites(userId) {
  if (!userId) return [];
  if (isGuestUser(userId)) {
    try {
      return JSON.parse(localStorage.getItem(`smartrecipe_favs_${userId}`) || "[]");
    } catch {
      return [];
    }
  }
  const path = "favorites";
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
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      // Fall back to local items if offline or error
      try {
        return JSON.parse(localStorage.getItem(`smartrecipe_favs_${userId}`) || "[]");
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function addFavorite(userId, recipe) {
  if (!userId || !recipe) return;
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = sanitizeDocId(userId, recipeId);
  const path = `favorites/${docId}`;

  const payload = {
    userId,
    recipeId,
    title: (recipe.title || "Untitled Recipe").slice(0, 256),
    image: recipe.image ? String(recipe.image).slice(0, 1024) : "",
    readyInMinutes: Number(recipe.readyInMinutes) || 0,
    healthScore: Number(recipe.healthScore || recipe.spoonacularScore) || 0,
    addedAt: new Date().toISOString()
  };

  if (isGuestUser(userId)) {
    try {
      const existing = JSON.parse(localStorage.getItem(`smartrecipe_favs_${userId}`) || "[]");
      const next = [payload, ...existing.filter((f) => String(f.recipeId) !== recipeId)];
      localStorage.setItem(`smartrecipe_favs_${userId}`, JSON.stringify(next));
    } catch {
      // Ignored
    }
    return payload;
  }

  try {
    const favDoc = doc(db, "favorites", docId);
    await setDoc(favDoc, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeFavorite(userId, recipeId) {
  if (!userId || !recipeId) return;
  const docId = sanitizeDocId(userId, recipeId);
  const path = `favorites/${docId}`;

  if (isGuestUser(userId)) {
    try {
      const existing = JSON.parse(localStorage.getItem(`smartrecipe_favs_${userId}`) || "[]");
      const next = existing.filter((f) => String(f.recipeId) !== String(recipeId));
      localStorage.setItem(`smartrecipe_favs_${userId}`, JSON.stringify(next));
    } catch {
      // Ignored
    }
    return;
  }

  try {
    await deleteDoc(doc(db, "favorites", docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// Saved Recipes (Bookmarks)
// ----------------------------------------------------

export async function getSavedRecipes(userId) {
  if (!userId) return [];
  if (isGuestUser(userId)) {
    try {
      return JSON.parse(localStorage.getItem(`smartrecipe_saved_${userId}`) || "[]");
    } catch {
      return [];
    }
  }
  const path = "savedRecipes";
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
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      try {
        return JSON.parse(localStorage.getItem(`smartrecipe_saved_${userId}`) || "[]");
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function saveRecipe(userId, recipe) {
  if (!userId || !recipe) return;
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = sanitizeDocId(userId, recipeId);
  const path = `savedRecipes/${docId}`;

  const payload = {
    userId,
    recipeId,
    title: (recipe.title || "Untitled Recipe").slice(0, 256),
    image: recipe.image ? String(recipe.image).slice(0, 1024) : "",
    summary: recipe.summary ? String(recipe.summary).slice(0, 4000) : "",
    readyInMinutes: Number(recipe.readyInMinutes) || 0,
    savedAt: new Date().toISOString()
  };

  if (isGuestUser(userId)) {
    try {
      const existing = JSON.parse(localStorage.getItem(`smartrecipe_saved_${userId}`) || "[]");
      const next = [payload, ...existing.filter((s) => String(s.recipeId) !== recipeId)];
      localStorage.setItem(`smartrecipe_saved_${userId}`, JSON.stringify(next));
    } catch {
      // Ignored
    }
    return payload;
  }

  try {
    const savedDoc = doc(db, "savedRecipes", docId);
    await setDoc(savedDoc, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeSavedRecipe(userId, recipeId) {
  if (!userId || !recipeId) return;
  const docId = sanitizeDocId(userId, recipeId);
  const path = `savedRecipes/${docId}`;

  if (isGuestUser(userId)) {
    try {
      const existing = JSON.parse(localStorage.getItem(`smartrecipe_saved_${userId}`) || "[]");
      const next = existing.filter((s) => String(s.recipeId) !== String(recipeId));
      localStorage.setItem(`smartrecipe_saved_${userId}`, JSON.stringify(next));
    } catch {
      // Ignored
    }
    return;
  }

  try {
    await deleteDoc(doc(db, "savedRecipes", docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// Search History
// ----------------------------------------------------

export async function addSearchHistory(userId, ingredients = [], filters = {}, queryText = "") {
  if (!userId) return;
  const record = {
    id: "hist_" + Date.now(),
    userId,
    query: (queryText || (Array.isArray(ingredients) ? ingredients.join(", ") : "")).slice(0, 256),
    ingredients: Array.isArray(ingredients) ? ingredients.slice(0, 20) : [],
    filters: filters || {},
    searchedAt: new Date().toISOString()
  };

  if (isGuestUser(userId)) {
    try {
      const key = `smartrecipe_history_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const next = [record, ...existing.filter((r) => r.query !== record.query)].slice(0, 20);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Ignored
    }
    return;
  }

  const path = "searchHistory";
  try {
    await addDoc(collection(db, "searchHistory"), {
      userId: record.userId,
      query: record.query,
      ingredients: record.ingredients,
      filters: record.filters,
      searchedAt: record.searchedAt
    });
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.CREATE, path);
    } catch {
      console.warn("Could not record search history in Firestore:", err);
    }
  }
}

export async function getSearchHistory(userId, limitCount = 10) {
  if (!userId) return [];
  if (isGuestUser(userId)) {
    try {
      const key = `smartrecipe_history_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      return existing.slice(0, limitCount);
    } catch {
      return [];
    }
  }
  const path = "searchHistory";
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
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      try {
        const key = `smartrecipe_history_${userId}`;
        return JSON.parse(localStorage.getItem(key) || "[]").slice(0, limitCount);
      } catch {
        return [];
      }
    }
    return [];
  }
}

export async function clearSearchHistory(userId) {
  if (!userId) return;
  if (isGuestUser(userId)) {
    try {
      localStorage.removeItem(`smartrecipe_history_${userId}`);
    } catch {
      // Ignored
    }
    return;
  }
  const path = "searchHistory";
  try {
    const q = query(collection(db, "searchHistory"), where("userId", "==", userId));
    const snap = await getDocs(q);
    const deletes = [];
    snap.forEach((docItem) => {
      deletes.push(deleteDoc(doc(db, "searchHistory", docItem.id)));
    });
    await Promise.all(deletes);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ----------------------------------------------------
// Recently Viewed
// ----------------------------------------------------

export async function addRecentlyViewed(userId, recipe) {
  if (!userId || !recipe) return;
  const recipeId = String(recipe.id || recipe.recipeId);
  const docId = sanitizeDocId(userId, recipeId);
  const path = `recentlyViewed/${docId}`;

  const payload = {
    userId,
    recipeId,
    title: (recipe.title || "Untitled Recipe").slice(0, 256),
    image: recipe.image ? String(recipe.image).slice(0, 1024) : "",
    readyInMinutes: Number(recipe.readyInMinutes) || 0,
    healthScore: Number(recipe.healthScore || recipe.spoonacularScore) || 0,
    viewedAt: new Date().toISOString()
  };

  if (isGuestUser(userId)) {
    try {
      const key = `smartrecipe_recent_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const next = [payload, ...existing.filter((e) => String(e.recipeId) !== recipeId)].slice(0, 10);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Ignored
    }
    return;
  }

  try {
    const viewDoc = doc(db, "recentlyViewed", docId);
    await setDoc(viewDoc, payload, { merge: true });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // Ignored non-critical recentlyViewed
    }
  }
}

export async function getRecentlyViewed(userId, limitCount = 8) {
  if (!userId) return [];
  if (isGuestUser(userId)) {
    try {
      const key = `smartrecipe_recent_${userId}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      return existing.slice(0, limitCount);
    } catch {
      return [];
    }
  }
  const path = "recentlyViewed";
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
    try {
      handleFirestoreError(err, OperationType.LIST, path);
    } catch {
      try {
        const key = `smartrecipe_recent_${userId}`;
        return JSON.parse(localStorage.getItem(key) || "[]").slice(0, limitCount);
      } catch {
        return [];
      }
    }
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
