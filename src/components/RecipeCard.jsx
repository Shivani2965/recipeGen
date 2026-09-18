import { Link, useNavigate } from "react-router-dom";
import { Heart, Bookmark, Clock, Star, Flame, ArrowUpRight } from "lucide-react";
import {
  formatTime,
  formatRating,
  getDifficulty,
  getCalories,
  getDietaryTags
} from "../utils/helpers.js";
import { useRecipes } from "../context/RecipeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
const RecipeCard = ({ recipe }) => {
  const { isFavorite, isSaved, toggleFavorite, toggleSaveRecipe } = useRecipes();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const recipeId = String(recipe.id || recipe.recipeId);
  const favorited = isFavorite(recipeId);
  const saved = isSaved(recipeId);
  const timeStr = formatTime(recipe.readyInMinutes);
  const ratingStr = formatRating(recipe.spoonacularScore || recipe.healthScore || 90);
  const difficulty = getDifficulty(recipe.readyInMinutes, recipe.analyzedInstructions?.[0]?.steps?.length);
  const calories = getCalories(recipe);
  const tags = getDietaryTags(recipe);
  const fallbackImage = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80";
  const imageUrl = recipe.image || fallbackImage;
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      navigate("/login", { state: { message: "Sign in to save recipes to your favorites!" } });
      return;
    }
    await toggleFavorite(recipe);
  };
  const handleSaveClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      navigate("/login", { state: { message: "Sign in to bookmark recipes for later!" } });
      return;
    }
    await toggleSaveRecipe(recipe);
  };
  return <article
    id={`recipe-card-${recipeId}`}
    className="group bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1 relative"
  >
      {
    /* Image container */
  }
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
        <img
    src={imageUrl}
    alt={recipe.title}
    loading="lazy"
    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
    onError={(e) => {
      e.target.src = fallbackImage;
    }}
  />
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {
    /* Floating action buttons */
  }
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
    id={`fav-btn-${recipeId}`}
    type="button"
    onClick={handleFavoriteClick}
    className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${favorited ? "bg-rose-500 text-white shadow-sm" : "bg-white/90 text-stone-700 hover:text-rose-600 hover:bg-white"}`}
    aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
  >
            <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
          </button>
          <button
    id={`save-btn-${recipeId}`}
    type="button"
    onClick={handleSaveClick}
    className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${saved ? "bg-amber-500 text-white shadow-sm" : "bg-white/90 text-stone-700 hover:text-amber-600 hover:bg-white"}`}
    aria-label={saved ? "Remove from saved" : "Save recipe"}
  >
            <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
          </button>
        </div>

        {
    /* Rating and time pill */
  }
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            {ratingStr}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs">
            <Clock className="w-3 h-3 text-stone-200" />
            {timeStr}
          </span>
        </div>
      </div>

      {
    /* Body content */
  }
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {
    /* Tags */
  }
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
              {difficulty}
            </span>
            {calories && <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 text-[11px] font-medium">
                <Flame className="w-3 h-3 text-orange-500" />
                {calories}
              </span>}
            {tags.slice(0, 1).map((t) => <span key={t} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                {t}
              </span>)}
          </div>

          {
    /* Title */
  }
          <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
            {recipe.title}
          </h3>
        </div>

        {
    /* Footer actions */
  }
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            {recipe.servings ? `${recipe.servings} servings` : "Quick recipe"}
          </span>
          <Link
    to={`/recipe/${recipeId}`}
    id={`view-recipe-${recipeId}`}
    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 text-xs font-semibold transition-all cursor-pointer"
  >
            <span>View Recipe</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>;
};
export {
  RecipeCard
};
