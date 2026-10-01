import axios from "axios";

const API_BASE = "";

/**
 * Searches recipes based on ingredients, query, and filters
 * @param {Object} params
 * @returns {Promise<{ results: Array, totalResults: number, offset: number, number: number }>}
 */
export async function fetchRecipes(params = {}) {
  const queryParams = { ...params };
  if (Array.isArray(queryParams.ingredients)) {
    queryParams.ingredients = queryParams.ingredients.join(",");
  }

  const response = await axios.get(`${API_BASE}/api/recipes`, {
    params: queryParams,
    timeout: 15000,
  });

  return response.data;
}

/**
 * Fetches detailed information for a single recipe by its ID
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function fetchRecipeDetails(id) {
  if (!id) throw new Error("Recipe ID is required");
  const response = await axios.get(`${API_BASE}/api/recipes/${id}`, {
    timeout: 15000,
  });
  return response.data?.recipe || response.data;
}

/**
 * Fetches popular or featured recipes for home & dashboard screens
 * @param {number} number
 * @param {string} tags
 * @returns {Promise<Array>}
 */
export async function fetchPopularRecipes(number = 8, tags = "") {
  const response = await axios.get(`${API_BASE}/api/recipes/popular`, {
    params: { number, tags },
    timeout: 15000,
  });
  return response.data?.recipes || response.data?.results || [];
}

/**
 * Checks whether the backend has a configured Spoonacular API key
 * @returns {Promise<{ hasApiKey: boolean, message?: string }>}
 */
export async function checkApiStatus() {
  try {
    const response = await axios.get(`${API_BASE}/api/recipes/status`, {
      timeout: 8000,
    });
    return response.data;
  } catch {
    return { hasApiKey: true, message: "Using cached curated recipe collection." };
  }
}

/**
 * Initiates download of a recipe PDF card
 * @param {string|number} recipeId
 * @param {Object} recipeData
 * @returns {Promise<void>}
 */
export async function downloadRecipePdf(recipeId, recipeData = null) {
  const id = recipeId || recipeData?.id || recipeData?.recipeId;
  if (!id) throw new Error("Recipe ID is required to download PDF");

  const response = await axios.post(
    `${API_BASE}/api/recipes/${id}/pdf`,
    { recipe: recipeData },
    {
      responseType: "blob",
      timeout: 20000,
    }
  );

  const blob = new Blob([response.data], { type: "application/pdf" });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;

  const rawTitle = recipeData?.title || `recipe-${id}`;
  const safeFilename = rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40);

  link.setAttribute("download", `${safeFilename}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export default {
  fetchRecipes,
  fetchRecipeDetails,
  fetchPopularRecipes,
  checkApiStatus,
  downloadRecipePdf,
};
