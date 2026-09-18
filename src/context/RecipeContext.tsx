import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchRecipes,
  checkApiStatus,
  RecipeSearchResult,
  SearchFilterOptions,
} from '../services/recipeService.ts';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getSavedRecipes,
  saveRecipe,
  removeSavedRecipe,
  addSearchHistory,
  FavoriteItem,
  SavedRecipeItem,
} from '../services/firestoreService.ts';
import { useAuth } from './AuthContext.tsx';

interface RecipeContextType {
  ingredients: string[];
  addIngredient: (item: string) => void;
  removeIngredient: (item: string) => void;
  clearIngredients: () => void;
  filters: SearchFilterOptions;
  setFilterValue: (key: keyof SearchFilterOptions, value: any) => void;
  clearFilters: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: RecipeSearchResult[];
  totalResults: number;
  loading: boolean;
  error: string | null;
  hasApiKey: boolean;
  executeSearch: (customIngredients?: string[], customQuery?: string, customFilters?: SearchFilterOptions) => Promise<void>;
  favorites: FavoriteItem[];
  savedRecipes: SavedRecipeItem[];
  toggleFavorite: (recipe: any) => Promise<boolean>;
  toggleSaveRecipe: (recipe: any) => Promise<boolean>;
  isFavorite: (id: string | number) => boolean;
  isSaved: (id: string | number) => boolean;
  refreshUserCollections: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [ingredients, setIngredients] = useState<string[]>(['chicken', 'garlic', 'tomato']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilterOptions>({
    cuisine: '',
    diet: '',
    mealType: '',
    maxReadyTime: undefined,
    sort: 'popularity',
  });
  const [searchResults, setSearchResults] = useState<RecipeSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // Firestore user data
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeItem[]>([]);

  // Check Spoonacular API status on mount
  useEffect(() => {
    checkApiStatus().then((status) => {
      setHasApiKey(status.hasApiKey);
      if (!status.hasApiKey) {
        setError('Spoonacular API key is not configured. Add SPOONACULAR_API_KEY in your environment or Settings.');
      }
    });
  }, []);

  // Fetch favorites and saved recipes when user changes
  const refreshUserCollections = useCallback(async () => {
    if (!currentUser) {
      setFavorites([]);
      setSavedRecipes([]);
      return;
    }
    try {
      const [favs, saved] = await Promise.all([
        getFavorites(currentUser.uid),
        getSavedRecipes(currentUser.uid),
      ]);
      setFavorites(favs);
      setSavedRecipes(saved);
    } catch (err) {
      console.error('Error fetching user recipe collections:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshUserCollections();
  }, [refreshUserCollections]);

  const addIngredient = (item: string) => {
    const clean = item.trim().toLowerCase();
    if (!clean) return;
    if (!ingredients.includes(clean)) {
      setIngredients((prev) => [...prev, clean]);
    }
  };

  const removeIngredient = (item: string) => {
    setIngredients((prev) => prev.filter((i) => i.toLowerCase() !== item.toLowerCase()));
  };

  const clearIngredients = () => {
    setIngredients([]);
  };

  const setFilterValue = (key: keyof SearchFilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      cuisine: '',
      diet: '',
      mealType: '',
      maxReadyTime: undefined,
      sort: 'popularity',
    });
  };

  const executeSearch = async (
    customIngredients?: string[],
    customQuery?: string,
    customFilters?: SearchFilterOptions
  ) => {
    const currentIngredients = customIngredients !== undefined ? customIngredients : ingredients;
    const currentQuery = customQuery !== undefined ? customQuery : searchQuery;
    const activeFilters = customFilters !== undefined ? customFilters : filters;

    if (currentIngredients.length === 0 && !currentQuery.trim()) {
      setError('Please enter at least one ingredient or a recipe name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchRecipes({
        ingredients: currentIngredients,
        query: currentQuery,
        ...activeFilters,
        number: 16,
      });

      setSearchResults(response.results || []);
      setTotalResults(response.totalResults || response.results?.length || 0);

      // Record in Firestore search history if user is signed in
      if (currentUser) {
        const cleanFilters: Record<string, any> = {};
        if (activeFilters?.cuisine) cleanFilters.cuisine = activeFilters.cuisine;
        if (activeFilters?.diet) cleanFilters.diet = activeFilters.diet;
        if (activeFilters?.mealType) cleanFilters.mealType = activeFilters.mealType;
        if (typeof activeFilters?.maxReadyTime === 'number') cleanFilters.maxReadyTime = activeFilters.maxReadyTime;
        if (activeFilters?.sort) cleanFilters.sort = activeFilters.sort;

        addSearchHistory(
          currentUser.uid,
          currentIngredients,
          cleanFilters,
          currentQuery || currentIngredients.join(', ')
        ).catch((e) => console.warn('Could not record search history:', e));
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong while finding recipes. Please try again.';
      setError(msg);
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (id: string | number): boolean => {
    const sId = String(id);
    return favorites.some((f) => String(f.recipeId) === sId);
  };

  const isSaved = (id: string | number): boolean => {
    const sId = String(id);
    return savedRecipes.some((s) => String(s.recipeId) === sId);
  };

  const toggleFavorite = async (recipe: any): Promise<boolean> => {
    if (!currentUser) return false;
    const recipeId = String(recipe.id || recipe.recipeId);
    const currentlyFav = isFavorite(recipeId);

    // Optimistic UI update
    if (currentlyFav) {
      setFavorites((prev) => prev.filter((f) => String(f.recipeId) !== recipeId));
      try {
        await removeFavorite(currentUser.uid, recipeId);
      } catch (err) {
        // Revert on error
        await refreshUserCollections();
        throw err;
      }
      return false;
    } else {
      const tempFav: FavoriteItem = {
        userId: currentUser.uid,
        recipeId,
        title: recipe.title || 'Untitled',
        image: recipe.image || '',
        addedAt: new Date().toISOString(),
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

  const toggleSaveRecipe = async (recipe: any): Promise<boolean> => {
    if (!currentUser) return false;
    const recipeId = String(recipe.id || recipe.recipeId);
    const currentlySaved = isSaved(recipeId);

    // Optimistic UI update
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
      const tempSaved: SavedRecipeItem = {
        userId: currentUser.uid,
        recipeId,
        title: recipe.title || 'Untitled',
        image: recipe.image || '',
        summary: recipe.summary || '',
        savedAt: new Date().toISOString(),
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

  return (
    <RecipeContext.Provider
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
        refreshUserCollections,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export function useRecipes(): RecipeContextType {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
