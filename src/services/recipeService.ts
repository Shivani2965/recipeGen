import api from './api.ts';

export interface SearchFilterOptions {
  query?: string;
  ingredients?: string[];
  cuisine?: string;
  diet?: string;
  mealType?: string;
  maxReadyTime?: number;
  sort?: string;
  number?: number;
  offset?: number;
}

export interface RecipeSearchResult {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  readyInMinutes?: number;
  servings?: number;
  cuisines?: string[];
  dishTypes?: string[];
  diets?: string[];
  spoonacularScore?: number;
  healthScore?: number;
  nutrition?: {
    nutrients?: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  summary?: string;
  extendedIngredients?: Array<{
    id: number;
    name: string;
    original: string;
    amount: number;
    unit: string;
  }>;
  analyzedInstructions?: Array<{
    name: string;
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
}

export async function fetchRecipes(params: SearchFilterOptions) {
  const queryParams: Record<string, any> = {};

  if (params.query) queryParams.query = params.query;
  if (params.ingredients && params.ingredients.length > 0) {
    queryParams.ingredients = params.ingredients.join(',');
  }
  if (params.cuisine) queryParams.cuisine = params.cuisine;
  if (params.diet) queryParams.diet = params.diet;
  if (params.mealType) queryParams.mealType = params.mealType;
  if (params.maxReadyTime) queryParams.maxReadyTime = params.maxReadyTime;
  if (params.sort) queryParams.sort = params.sort;
  if (params.number) queryParams.number = params.number;
  if (params.offset) queryParams.offset = params.offset;

  const response = await api.get('/recipes/search', { params: queryParams });
  return response.data;
}

export async function fetchRecipeDetails(id: string | number) {
  const response = await api.get(`/recipes/${id}`);
  return response.data.recipe;
}

export async function fetchPopularRecipes(number: number = 8, tags: string = '') {
  const response = await api.get('/recipes/popular', {
    params: { number, tags },
  });
  return response.data.recipes || [];
}

export async function downloadRecipePdf(id: string | number, recipeData?: any) {
  const response = await api.post(
    `/recipes/${id}/pdf`,
    { recipe: recipeData },
    {
      responseType: 'blob',
    }
  );

  const safeTitle = (recipeData?.title || `recipe-${id}`)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);

  // Trigger browser download via Blob
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${safeTitle}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export async function checkApiStatus() {
  try {
    const response = await api.get('/recipes/status');
    return response.data;
  } catch (err: any) {
    return {
      hasApiKey: false,
      message: err.response?.data?.message || 'Cannot reach SmartRecipe backend service.',
    };
  }
}
