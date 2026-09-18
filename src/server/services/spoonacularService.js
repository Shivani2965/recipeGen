import axios from "axios";
import fs from "fs";
import path from "path";
import {
  SAMPLE_RECIPES,
  findSampleRecipes,
  getSampleRecipeById
} from "./sampleRecipes.js";

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";
const recipeCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 mins
function getApiKey() {
  let rawKey = process.env.SPOONACULAR_API_KEY || process.env.VITE_SPOONACULAR_API_KEY;
  if (!rawKey || rawKey.trim() === "" || rawKey === "your_spoonacular_api_key_here") {
    const envPaths = [path.resolve(process.cwd(), ".env"), path.resolve(process.cwd(), ".env.example")];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, "utf-8");
          const match = content.match(/^SPOONACULAR_API_KEY\s*=\s*(.+)$/m);
          if (match && match[1]) {
            const parsed = match[1].trim().replace(/^["']|["']$/g, "");
            if (parsed && parsed !== "your_spoonacular_api_key_here") {
              rawKey = parsed;
              process.env.SPOONACULAR_API_KEY = parsed;
              break;
            }
          }
        } catch {
        }
      }
    }
  }
  if (!rawKey) return null;
  const key = rawKey.trim().replace(/^["']|["']$/g, "");
  if (!key || key === "your_spoonacular_api_key_here") {
    return null;
  }
  return key;
}
function isApiKeyConfigured() {
  return getApiKey() !== null;
}
async function searchRecipes(params) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return findSampleRecipes(params);
  }

  const queryParams = {
    apiKey,
    addRecipeInformation: true,
    addRecipeNutrition: true,
    number: params.number || 12,
    offset: params.offset || 0,
    fillIngredients: true
  };

  if (params.query && params.query.trim()) {
    queryParams.query = params.query.trim();
  }
  if (params.ingredients && params.ingredients.length > 0) {
    queryParams.includeIngredients = params.ingredients.join(",");
  }
  if (params.cuisine && params.cuisine.trim()) {
    queryParams.cuisine = params.cuisine.trim();
  }
  if (params.diet && params.diet.trim()) {
    queryParams.diet = params.diet.trim();
  }
  if (params.mealType && params.mealType.trim()) {
    queryParams.type = params.mealType.trim();
  }
  if (params.maxReadyTime && params.maxReadyTime > 0) {
    queryParams.maxReadyTime = params.maxReadyTime;
  }
  if (params.sort && params.sort.trim()) {
    queryParams.sort = params.sort.trim();
  }

  const cacheKey = `search_${JSON.stringify(queryParams)}`;
  const cached = recipeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
      params: queryParams,
      timeout: 10000
    });
    const data = response.data;

    // If Spoonacular returned an empty results array despite a non-zero totalResults estimate,
    // or if Spoonacular found 0 items, check if our sample recipes match the query or ingredients
    if (!data.results || data.results.length === 0) {
      const fallback = findSampleRecipes(params);
      if (fallback.results && fallback.results.length > 0) {
        recipeCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
        return fallback;
      }
      // If no sample recipes match either, ensure totalResults is 0 so the UI doesn't contradict itself
      data.totalResults = 0;
    }

    recipeCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.warn("Spoonacular search failed, falling back to curated recipes:", err.response?.data?.message || err.message);
    const fallback = findSampleRecipes(params);
    if (fallback.results && fallback.results.length > 0) {
      return fallback;
    }
    if (err.response?.status === 402 || err.response?.status === 429) {
      return {
        results: [],
        totalResults: 0,
        offset: 0,
        number: params.number || 12
      };
    }
    handleAxiosError(err);
  }
}

async function getRecipeById(id) {
  const sample = getSampleRecipeById(id);
  if (sample) {
    return sample;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("SPOONACULAR_API_KEY is not configured. Please set your Spoonacular API key in your environment variables.");
  }

  const cacheKey = `recipe_${id}`;
  const cached = recipeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${id}/information`, {
      params: {
        apiKey,
        includeNutrition: true
      },
      timeout: 10000
    });
    const data = response.data;
    recipeCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    const fallbackSample = getSampleRecipeById(id);
    if (fallbackSample) return fallbackSample;
    handleAxiosError(err);
  }
}

async function getRandomRecipes(number = 8, tags = "") {
  const apiKey = getApiKey();
  if (!apiKey) {
    return SAMPLE_RECIPES.slice(0, number);
  }

  const cacheKey = `random_${number}_${tags}`;
  const cached = recipeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/random`, {
      params: {
        apiKey,
        number,
        tags: tags || void 0
      },
      timeout: 10000
    });
    const data = response.data;
    recipeCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.warn("Spoonacular random fetch failed, falling back to curated sample recipes:", err.response?.data?.message || err.message);
    return { recipes: SAMPLE_RECIPES.slice(0, number) };
  }
}
function handleAxiosError(err) {
  if (err.response) {
    const status = err.response.status;
    const msg = err.response.data?.message || err.response.statusText || "External API error";
    if (status === 401) {
      throw new Error("Invalid Spoonacular API key. Please check your credentials.");
    }
    if (status === 402) {
      throw new Error("Spoonacular daily API request quota exceeded. Please try again tomorrow or upgrade your plan.");
    }
    if (status === 404) {
      throw new Error("Recipe not found.");
    }
    throw new Error(`Spoonacular API error (${status}): ${msg}`);
  }
  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    throw new Error("Request to Spoonacular timed out. Please check your internet connection.");
  }
  throw new Error(err.message || "Failed to connect to recipe service.");
}
export {
  getRandomRecipes,
  getRecipeById,
  isApiKeyConfigured,
  searchRecipes
};
