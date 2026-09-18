import { Request, Response, NextFunction } from 'express';
import {
  searchRecipes,
  getRecipeById,
  getRandomRecipes,
  isApiKeyConfigured,
} from '../services/spoonacularService.ts';

export async function searchRecipesController(req: Request, res: Response, next: NextFunction) {
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
      offset,
    } = req.query;

    let ingredientsList: string[] = [];
    if (typeof ingredients === 'string' && ingredients.trim()) {
      ingredientsList = ingredients
        .split(',')
        .map((i) => i.trim().toLowerCase())
        .filter(Boolean);
    } else if (Array.isArray(ingredients)) {
      ingredientsList = (ingredients as string[])
        .map((i) => i.trim().toLowerCase())
        .filter(Boolean);
    }

    const results = await searchRecipes({
      query: typeof query === 'string' ? query : undefined,
      ingredients: ingredientsList,
      cuisine: typeof cuisine === 'string' ? cuisine : undefined,
      diet: typeof diet === 'string' ? diet : undefined,
      mealType: typeof mealType === 'string' ? mealType : undefined,
      maxReadyTime: maxReadyTime ? Number(maxReadyTime) : undefined,
      sort: typeof sort === 'string' ? sort : undefined,
      number: number ? Number(number) : 12,
      offset: offset ? Number(offset) : 0,
    });

    res.json({
      success: true,
      results: results.results || results,
      totalResults: results.totalResults ?? (results.results?.length || 0),
      offset: results.offset ?? 0,
      number: results.number ?? (results.results?.length || 0),
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecipeByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ success: false, message: 'Recipe ID is required.' });
      return;
    }

    const recipe = await getRecipeById(id);
    res.json({
      success: true,
      recipe,
    });
  } catch (err) {
    next(err);
  }
}

export async function getPopularRecipesController(req: Request, res: Response, next: NextFunction) {
  try {
    const number = req.query.number ? Number(req.query.number) : 8;
    const tags = typeof req.query.tags === 'string' ? req.query.tags : '';
    const result = await getRandomRecipes(number, tags);

    res.json({
      success: true,
      recipes: result.recipes || [],
    });
  } catch (err) {
    next(err);
  }
}

export function getConfigStatusController(_req: Request, res: Response) {
  res.json({
    success: true,
    hasApiKey: isApiKeyConfigured(),
    message: isApiKeyConfigured()
      ? 'Spoonacular API key is active.'
      : 'Spoonacular API key is not configured. Add SPOONACULAR_API_KEY in your environment or Settings.',
  });
}
