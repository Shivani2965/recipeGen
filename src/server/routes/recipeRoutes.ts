import { Router } from 'express';
import {
  searchRecipesController,
  getRecipeByIdController,
  getPopularRecipesController,
  getConfigStatusController,
} from '../controllers/recipeController.ts';

const router = Router();

router.get('/status', getConfigStatusController);
router.get('/popular', getPopularRecipesController);
router.get('/search', searchRecipesController);
router.get('/:id', getRecipeByIdController);

export default router;
