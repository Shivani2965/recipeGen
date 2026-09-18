import {
  searchRecipes,
  getRecipeById,
  getRandomRecipes,
  isApiKeyConfigured
} from "../services/spoonacularService.js";
async function searchRecipesController(req, res, next) {
  try {
    const {
      query,
      ingredients,
      cuisine,
      diet,
      mealType,
      maxReadyTime,
      sort,
      number,
      offset
    } = req.query;
    let ingredientsList = [];
    if (typeof ingredients === "string" && ingredients.trim()) {
      ingredientsList = ingredients.split(",").map((i) => i.trim().toLowerCase()).filter(Boolean);
    } else if (Array.isArray(ingredients)) {
      ingredientsList = ingredients.map((i) => i.trim().toLowerCase()).filter(Boolean);
    }
    const results = await searchRecipes({
      query: typeof query === "string" ? query : void 0,
      ingredients: ingredientsList,
      cuisine: typeof cuisine === "string" ? cuisine : void 0,
      diet: typeof diet === "string" ? diet : void 0,
      mealType: typeof mealType === "string" ? mealType : void 0,
      maxReadyTime: maxReadyTime ? Number(maxReadyTime) : void 0,
      sort: typeof sort === "string" ? sort : void 0,
      number: number ? Number(number) : 12,
      offset: offset ? Number(offset) : 0
    });
    const recipeList = Array.isArray(results.results)
      ? results.results
      : (Array.isArray(results) ? results : []);
    const count = recipeList.length;
    const finalTotal = count === 0 ? 0 : (results.totalResults ?? count);

    res.json({
      success: true,
      results: recipeList,
      totalResults: finalTotal,
      offset: results.offset ?? 0,
      number: results.number ?? count
    });
  } catch (err) {
    next(err);
  }
}
async function getRecipeByIdController(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: "Recipe ID is required." });
      return;
    }
    const recipe = await getRecipeById(id);
    res.json({
      success: true,
      recipe
    });
  } catch (err) {
    next(err);
  }
}
async function getPopularRecipesController(req, res, next) {
  try {
    const number = req.query.number ? Number(req.query.number) : 8;
    const tags = typeof req.query.tags === "string" ? req.query.tags : "";
    const result = await getRandomRecipes(number, tags);
    res.json({
      success: true,
      recipes: result.recipes || []
    });
  } catch (err) {
    next(err);
  }
}
function getConfigStatusController(_req, res) {
  res.json({
    success: true,
    hasApiKey: isApiKeyConfigured(),
    message: isApiKeyConfigured() ? "Spoonacular API key is active." : "Spoonacular API key is not configured. Add SPOONACULAR_API_KEY in your environment or Settings."
  });
}
export {
  getConfigStatusController,
  getPopularRecipesController,
  getRecipeByIdController,
  searchRecipesController
};
