import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchRecipes,
  checkApiStatus
} from "../services/recipeService.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getSavedRecipes,
  saveRecipe,
  removeSavedRecipe,
  addSearchHistory
} from "../services/firestoreService.js";
import { useAuth } from "./AuthContext.jsx";
const RecipeContext = createContext(void 0);
const RecipeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [ingredients, setIngredients] = useState(["chicken", "garlic", "tomato"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: "",
    mealType: "",
    maxReadyTime: void 0,
    sort: "popularity"
  });
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  useEffect(() => {
    checkApiStatus().then((status) => {
      setHasApiKey(status.hasApiKey);
      if (!status.hasApiKey) {
        setError("Spoonacular API key is not configured. Add SPOONACULAR_API_KEY in your environment or Settings.");
      }
    });
  }, []);
  const refreshUserCollections = useCallback(async () => {
    if (!currentUser) {
      setFavorites([]);
      setSavedRecipes([]);
      return;
    }
    try {
      const [favs, saved] = await Promise.all([
        getFavorites(currentUser.uid),
        getSavedRecipes(currentUser.uid)
      ]);
      setFavorites(favs);
      setSavedRecipes(saved);
    } catch (err) {
      console.error("Error fetching user recipe collections:", err);
    }
  }, [currentUser]);
  useEffect(() => {
    refreshUserCollections();
  }, [refreshUserCollections]);
  const addIngredient = (item) => {
    const clean = item.trim().toLowerCase();
    if (!clean) return;
    if (!ingredients.includes(clean)) {
      setIngredients((prev) => [...prev, clean]);
    }
  };
  const removeIngredient = (item) => {
    setIngredients((prev) => prev.filter((i) => i.toLowerCase() !== item.toLowerCase()));
  };
  const clearIngredients = () => {
    setIngredients([]);
  };
  const setFilterValue = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };
  const clearFilters = () => {
    setFilters({
      cuisine: "",
      diet: "",
      mealType: "",
      maxReadyTime: void 0,
      sort: "popularity"
    });
  };
  const executeSearch = async (customIngredients, customQuery, customFilters) => {
    const currentIngredients = customIngredients !== void 0 ? customIngredients : ingredients;
    const currentQuery = customQuery !== void 0 ? customQuery : searchQuery;
    const activeFilters = customFilters !== void 0 ? customFilters : filters;
    if (currentIngredients.length === 0 && !currentQuery.trim()) {
      setError("Please enter at least one ingredient or a recipe name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRecipes({
        ingredients: currentIngredients,
        query: currentQuery,
        ...activeFilters,
        number: 16
      });
      const resList = response.results || [];
      setSearchResults(resList);
      setTotalResults(resList.length === 0 ? 0 : (response.totalResults || resList.length));
      if (currentUser) {
        const cleanFilters = {};
        if (activeFilters?.cuisine) cleanFilters.cuisine = activeFilters.cuisine;
        if (activeFilters?.diet) cleanFilters.diet = activeFilters.diet;
        if (activeFilters?.mealType) cleanFilters.mealType = activeFilters.mealType;
        if (typeof activeFilters?.maxReadyTime === "number") cleanFilters.maxReadyTime = activeFilters.maxReadyTime;
        if (activeFilters?.sort) cleanFilters.sort = activeFilters.sort;
        addSearchHistory(
          currentUser.uid,
          currentIngredients,
          cleanFilters,
          currentQuery || currentIngredients.join(", ")
        ).catch((e) => console.warn("Could not record search history:", e));
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong while finding recipes. Please try again.";
      setError(msg);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };
  const isFavorite = (id) => {
    const sId = String(id);
    return favorites.some((f) => String(f.recipeId) === sId);
  };
  const isSaved = (id) => {
    const sId = String(id);
    return savedRecipes.some((s) => String(s.recipeId) === sId);
  };
  const toggleFavorite = async (recipe) => {
    if (!currentUser) return false;
    const recipeId = String(recipe.id || recipe.recipeId);
    const currentlyFav = isFavorite(recipeId);
    if (currentlyFav) {
      setFavorites((prev) => prev.filter((f) => String(f.recipeId) !== recipeId));
      try {
        await removeFavorite(currentUser.uid, recipeId);
      } catch (err) {
        await refreshUserCollections();
        throw err;
      }
      return false;
    } else {
      const tempFav = {
        userId: currentUser.uid,
        recipeId,
        title: recipe.title || "Untitled",
        image: recipe.image || "",
        addedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      setFavorites((prev) => [tempFav, ...prev]);
      try {
        await addFavorite(currentUser.uid, recipe);
      } catch (err) {
        await refreshUserCollections();
        throw err;
      }
      return true;
    }
  };
  const toggleSaveRecipe = async (recipe) => {
    if (!currentUser) return false;
    const recipeId = String(recipe.id || recipe.recipeId);
    const currentlySaved = isSaved(recipeId);
    if (currentlySaved) {
      setSavedRecipes((prev) => prev.filter((s) => String(s.recipeId) !== recipeId));
      try {
        await removeSavedRecipe(currentUser.uid, recipeId);
      } catch (err) {
        await refreshUserCollections();
        throw err;
      }
      return false;
    } else {
      const tempSaved = {
        userId: currentUser.uid,
        recipeId,
        title: recipe.title || "Untitled",
        image: recipe.image || "",
        summary: recipe.summary || "",
        savedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      setSavedRecipes((prev) => [tempSaved, ...prev]);
      try {
        await saveRecipe(currentUser.uid, recipe);
      } catch (err) {
        await refreshUserCollections();
        throw err;
      }
      return true;
    }
  };
  return <RecipeContext.Provider
    value={{
      ingredients,
      addIngredient,
      removeIngredient,
      clearIngredients,
      filters,
      setFilterValue,
      clearFilters,
      searchQuery,
      setSearchQuery,
      searchResults,
      totalResults,
      loading,
      error,
      hasApiKey,
      executeSearch,
      favorites,
      savedRecipes,
      toggleFavorite,
      toggleSaveRecipe,
      isFavorite,
      isSaved,
      refreshUserCollections
    }}
  >
      {children}
    </RecipeContext.Provider>;
};
function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
}
export {
  RecipeProvider,
  useRecipes
};
