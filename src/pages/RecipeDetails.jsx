import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Youtube,
  ExternalLink,
  Play
} from "lucide-react";
import {
  fetchRecipeDetails,
  downloadRecipePdf
} from "../services/recipeService.js";
import {
  addRecentlyViewed
} from "../services/firestoreService.js";
import {
  stripHtml,
  formatTime,
  formatRating,
  getCalories,
  getProtein,
  getDietaryTags,
  getRecipeYouTubeUrl,
  getYouTubeEmbedUrl
} from "../utils/helpers.js";
import { useRecipes } from "../context/RecipeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";
import { ErrorMessage } from "../components/ErrorMessage.jsx";
const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isFavorite, isSaved, toggleFavorite, toggleSaveRecipe } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchRecipeDetails(id).then((data) => {
      if (!mounted) return;
      setRecipe(data);
      setLoading(false);
      if (currentUser && data) {
        addRecentlyViewed(currentUser.uid, data).catch(
          (e) => console.warn("Could not record recently viewed:", e)
        );
      }
    }).catch((err) => {
      if (!mounted) return;
      setError(err.response?.data?.message || err.message || "Failed to load recipe details.");
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [id, currentUser]);
  const toggleCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  const handleDownloadPdf = async () => {
    if (!recipe) return;
    setDownloadingPdf(true);
    setPdfError(null);
    try {
      await downloadRecipePdf(recipe.id, recipe);
    } catch (err) {
      console.error("PDF export error:", err);
      setPdfError("Could not download PDF. Please try again.");
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
    }
  };
  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center bg-stone-50">
        <LoadingSpinner size="lg" text="Preparing recipe culinary card..." />
      </div>;
  }
  if (error || !recipe) {
    return <div className="min-h-[70vh] max-w-2xl mx-auto p-6 flex flex-col justify-center items-center">
        <ErrorMessage message={error || "Recipe not found."} onRetry={() => window.location.reload()} />
        <Link
      to="/explore"
      className="inline-flex items-center gap-2 mt-4 text-amber-700 hover:text-amber-800 font-semibold text-sm"
    >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipe Discovery
        </Link>
      </div>;
  }
  const recipeId = String(recipe.id);
  const favorited = isFavorite(recipeId);
  const saved = isSaved(recipeId);
  const dietaryTags = getDietaryTags(recipe);
  const calories = getCalories(recipe);
  const protein = getProtein(recipe);
  const youtubeUrl = getRecipeYouTubeUrl(recipe);
  const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
  const instructionsList = recipe.analyzedInstructions?.[0]?.steps?.map((s) => s.step) || (typeof recipe.instructions === "string" ? recipe.instructions.split(/(?:\r\n|\r|\n)+/).map((line) => stripHtml(line)).filter((line) => line.length > 5) : []);
  return <div id="recipe-details-container" className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {
    /* Navigation back */
  }
        <div className="flex items-center justify-between">
          <button
    type="button"
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm font-semibold transition-colors cursor-pointer"
  >
            <ArrowLeft className="w-4 h-4" />
            Back to recipes
          </button>

          {
    /* Action bar */
  }
          <div className="flex items-center gap-2">
            <a
              id="details-youtube-link-btn"
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Watch video tutorial on YouTube"
            >
              <Youtube className="w-3.5 h-3.5 fill-current" />
              <span>Watch Video</span>
            </a>
            <button
    id="details-share-btn"
    type="button"
    onClick={handleShare}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
  >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share"}</span>
            </button>
            <button
    id="details-export-pdf-btn"
    type="button"
    onClick={handleDownloadPdf}
    disabled={downloadingPdf}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
  >
              <FileDown className="w-3.5 h-3.5" />
              <span>{downloadingPdf ? "Generating PDF..." : "Export PDF"}</span>
            </button>
          </div>
        </div>

        {pdfError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
            <span>{pdfError}</span>
            <button
              onClick={() => setPdfError(null)}
              className="text-rose-500 hover:text-rose-800 font-bold ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {
    /* Hero Card */
  }
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-2xs overflow-hidden">
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-stone-900">
            <img
    src={recipe.image || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200"}
    alt={recipe.title}
    className="w-full h-full object-cover opacity-90"
  />
            <div className="absolute inset-0 bg-linear-to-t from-stone-950 via-stone-950/40 to-transparent" />

            {
    /* Float Favorite / Save */
  }
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
    id="details-fav-btn"
    type="button"
    onClick={() => toggleFavorite(recipe)}
    className={`p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${favorited ? "bg-rose-500 text-white shadow-md" : "bg-white/90 text-stone-700 hover:text-rose-600 hover:bg-white"}`}
    title={favorited ? "Remove from favorites" : "Add to favorites"}
  >
                <Heart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
              </button>
              <button
    id="details-save-btn"
    type="button"
    onClick={() => toggleSaveRecipe(recipe)}
    className={`p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${saved ? "bg-amber-500 text-white shadow-md" : "bg-white/90 text-stone-700 hover:text-amber-600 hover:bg-white"}`}
    title={saved ? "Remove from saved" : "Save recipe"}
  >
                <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
              </button>
            </div>

            {
    /* Bottom Title on Image */
  }
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex flex-wrap gap-2 mb-1">
                {dietaryTags.map((tag) => <span
    key={tag}
    className="px-2.5 py-0.5 rounded-full bg-amber-600/90 text-white text-xs font-semibold backdrop-blur-xs"
  >
                    {tag}
                  </span>)}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {recipe.title}
              </h1>
            </div>
          </div>

          {
    /* Quick Metrics Strip */
  }
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 border-b border-stone-100 bg-stone-50/50 p-4">
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-stone-500 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Total Time</span>
              </div>
              <p className="font-bold text-base text-stone-900">{formatTime(recipe.readyInMinutes)}</p>
            </div>
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-stone-500 mb-1">
                <Users className="w-4 h-4 text-amber-600" />
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
              <p className="font-bold text-base text-stone-900">{calories || "420 kcal"}</p>
            </div>
          </div>

          {
    /* Summary & YouTube Video Guide */
  }
          <div className="p-6 sm:p-8 border-b border-stone-100 bg-linear-to-b from-white to-stone-50/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                About this dish
              </h2>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer group"
              >
                <Youtube className="w-4 h-4 fill-current text-red-600 group-hover:scale-110 transition-transform" />
                <span>Watch video tutorial on YouTube</span>
                <ExternalLink className="w-3 h-3 text-red-400 group-hover:text-red-600" />
              </a>
            </div>

            {recipe.summary && (
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed mb-4">
                {stripHtml(recipe.summary)}
              </p>
            )}

            {/* YouTube Callout Card in Description */}
            <div className="mt-4 p-4 rounded-2xl bg-red-50/70 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Youtube className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    Step-by-Step Cooking Video
                  </h4>
                  <p className="text-xs text-stone-600">
                    Watch the chef demonstrate ingredients, prep techniques, and culinary tips on YouTube.
                  </p>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-red-700 hover:text-red-800 underline break-all inline-flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    <span>{youtubeUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {embedUrl && (
                  <button
                    type="button"
                    onClick={() => setShowVideoModal((prev) => !prev)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-300 bg-white hover:bg-red-100 text-red-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{showVideoModal ? "Hide Preview" : "Preview Video"}</span>
                  </button>
                )}
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Embedded YouTube Video Preview */}
            {showVideoModal && embedUrl && (
              <div className="mt-4">
                <div className="rounded-2xl overflow-hidden border border-red-200 shadow-md aspect-16/9 bg-stone-900 relative">
                  <iframe
                    src={embedUrl}
                    title={`${recipe.title} Cooking Video`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-stone-500 px-1">
                  <span>Official YouTube Tutorial Player</span>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Watch directly on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {
    /* Two-Column Recipe Breakdown */
  }
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
            {
    /* Ingredients Checklist */
  }
            <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-50/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-amber-700" />
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
                {(recipe.extendedIngredients || []).map((ing, idx) => {
    const isChecked = checkedIngredients[idx];
    return <label
      key={idx}
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${isChecked ? "bg-amber-50/70 border-amber-200 text-stone-400 line-through" : "bg-white border-stone-200/80 text-stone-800 hover:border-amber-300"}`}
      onClick={() => toggleCheck(idx)}
    >
                      <div
      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${isChecked ? "bg-amber-700 border-amber-700 text-white" : "border-stone-300 bg-white"}`}
    >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium leading-snug">
                        {ing.original || `${ing.amount || ""} ${ing.unit || ""} ${ing.name}`}
                      </span>
                    </label>;
  })}
              </div>
            </div>

            {
    /* Cooking Instructions */
  }
            <div className="lg:col-span-7 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-lg text-stone-900">Instructions</h3>
              </div>

              {instructionsList.length > 0 ? <ol className="space-y-6">
                  {instructionsList.map((step, idx) => <li key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1 text-sm sm:text-base text-stone-700 leading-relaxed pt-0.5">
                        {step}
                      </div>
                    </li>)}
                </ol> : <div className="p-4 rounded-xl bg-stone-100 text-stone-600 text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>
                    No detailed step breakdown available for this recipe. Follow traditional culinary preparation for best results.
                  </span>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  RecipeDetails
};
