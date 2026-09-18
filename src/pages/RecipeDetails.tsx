import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Users,
  Star,
  Flame,
  Heart,
  Bookmark,
  FileDown,
  Share2,
  ArrowLeft,
  Check,
  ChefHat,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  fetchRecipeDetails,
  downloadRecipePdf,
} from '../services/recipeService.ts';
import {
  addRecentlyViewed,
} from '../services/firestoreService.ts';
import {
  stripHtml,
  formatTime,
  formatRating,
  getCalories,
  getProtein,
  getDietaryTags,
} from '../utils/helpers.ts';
import { useRecipes } from '../context/RecipeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';

export const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isFavorite, isSaved, toggleFavorite, toggleSaveRecipe } = useRecipes();

  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchRecipeDetails(id)
      .then((data) => {
        if (!mounted) return;
        setRecipe(data);
        setLoading(false);

        // Record in recently viewed if logged in
        if (currentUser && data) {
          addRecentlyViewed(currentUser.uid, data).catch((e) =>
            console.warn('Could not record recently viewed:', e)
          );
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || 'Failed to load recipe details.');
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, currentUser]);

  const toggleCheck = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDownloadPdf = async () => {
    if (!recipe) return;
    setDownloadingPdf(true);
    try {
      await downloadRecipePdf(recipe.id, recipe);
    } catch (err: any) {
      console.error('PDF export error:', err);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-stone-50">
        <LoadingSpinner size="lg" text="Preparing recipe culinary card..." />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-[70vh] max-w-2xl mx-auto p-6 flex flex-col justify-center items-center">
        <ErrorMessage message={error || 'Recipe not found.'} onRetry={() => window.location.reload()} />
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mt-4 text-emerald-700 hover:text-emerald-800 font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipe Discovery
        </Link>
      </div>
    );
  }

  const recipeId = String(recipe.id);
  const favorited = isFavorite(recipeId);
  const saved = isSaved(recipeId);
  const dietaryTags = getDietaryTags(recipe);
  const calories = getCalories(recipe);
  const protein = getProtein(recipe);

  // Instructions normalization
  const instructionsList =
    recipe.analyzedInstructions?.[0]?.steps?.map((s: any) => s.step) ||
    (typeof recipe.instructions === 'string'
      ? recipe.instructions
          .split(/(?:\r\n|\r|\n)+/)
          .map((line: string) => stripHtml(line))
          .filter((line: string) => line.length > 5)
      : []);

  return (
    <div id="recipe-details-container" className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to recipes
          </button>

          {/* Action bar */}
          <div className="flex items-center gap-2">
            <button
              id="details-share-btn"
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              id="details-export-pdf-btn"
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{downloadingPdf ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-stone-900">
            <img
              src={
                recipe.image ||
                'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200'
              }
              alt={recipe.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />

            {/* Float Favorite / Save */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                id="details-fav-btn"
                type="button"
                onClick={() => toggleFavorite(recipe)}
                className={`p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  favorited
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white/90 text-stone-700 hover:text-rose-600 hover:bg-white'
                }`}
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
              </button>
              <button
                id="details-save-btn"
                type="button"
                onClick={() => toggleSaveRecipe(recipe)}
                className={`p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  saved
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-white/90 text-stone-700 hover:text-amber-600 hover:bg-white'
                }`}
                title={saved ? 'Remove from saved' : 'Save recipe'}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap gap-2 mb-1">
                {dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {recipe.title}
              </h1>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 border-b border-stone-100 bg-stone-50/50 p-4">
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-stone-500 mb-1">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Total Time</span>
              </div>
              <p className="font-bold text-base text-stone-900">{formatTime(recipe.readyInMinutes)}</p>
            </div>
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-stone-500 mb-1">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Servings</span>
              </div>
              <p className="font-bold text-base text-stone-900">{recipe.servings || 4} people</p>
            </div>
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-stone-500 mb-1">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span>Score</span>
              </div>
              <p className="font-bold text-base text-stone-900">
                {formatRating(recipe.spoonacularScore || recipe.healthScore || 90)} / 5.0
              </p>
            </div>
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-stone-500 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Calories</span>
              </div>
              <p className="font-bold text-base text-stone-900">{calories || '420 kcal'}</p>
            </div>
          </div>

          {/* Summary */}
          {recipe.summary && (
            <div className="p-6 sm:p-8 border-b border-stone-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                About this dish
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {stripHtml(recipe.summary)}
              </p>
            </div>
          )}

          {/* Two-Column Recipe Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
            {/* Ingredients Checklist */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-50/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-lg text-stone-900">Ingredients</h3>
                </div>
                <span className="text-xs text-stone-500">
                  {recipe.extendedIngredients?.length || 0} items
                </span>
              </div>
              <p className="text-xs text-stone-500 mb-4">
                Click an ingredient to check it off as you cook.
              </p>

              <div className="space-y-2.5">
                {(recipe.extendedIngredients || []).map((ing: any, idx: number) => {
                  const isChecked = checkedIngredients[idx];
                  return (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-200 text-stone-400 line-through'
                          : 'bg-white border-stone-200/80 text-stone-800 hover:border-emerald-300'
                      }`}
                      onClick={() => toggleCheck(idx)}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium leading-snug">
                        {ing.original || `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Cooking Instructions */}
            <div className="lg:col-span-7 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-lg text-stone-900">Instructions</h3>
              </div>

              {instructionsList.length > 0 ? (
                <ol className="space-y-6">
                  {instructionsList.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-sm sm:text-base text-stone-700 leading-relaxed pt-0.5">
                        {step}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="p-4 rounded-xl bg-stone-100 text-stone-600 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>
                    No detailed step breakdown available for this recipe. Follow traditional culinary preparation for best results.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
