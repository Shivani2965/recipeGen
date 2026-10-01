import { Router } from "express";
import {
  searchRecipesController,
  getRecipeByIdController,
  getPopularRecipesController,
  getConfigStatusController
} from "../controllers/recipeController.js";

const router = Router();

// Routes mounted at /api/recipes
router.get("/status", getConfigStatusController);
router.get("/popular", getPopularRecipesController);
router.get("/search", searchRecipesController);
router.get("/:id", getRecipeByIdController);
router.get("/", searchRecipesController);

// Support if matched with full path
router.get("/api/recipes/status", getConfigStatusController);
router.get("/api/recipes/popular", getPopularRecipesController);
router.get("/api/recipes/search", searchRecipesController);
router.get("/api/recipes/:id", getRecipeByIdController);
router.get("/api/recipes", searchRecipesController);

export default router;
