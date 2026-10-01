import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Bookmark,
  Clock,
  Search,
  Sparkles,
  ArrowRight,
  ChefHat,
  Flame
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRecipes } from "../context/RecipeContext.jsx";
import { RecipeCard } from "../components/RecipeCard.jsx";
import { fetchPopularRecipes } from "../services/recipeService.js";
import {
  getRecentlyViewed,
  getSearchHistory
} from "../services/firestoreService.js";
const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { favorites, savedRecipes, setSearchQuery, executeSearch } = useRecipes();
  const navigate = useNavigate();
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [recentViews, setRecentViews] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const getGreeting = () => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const displayName = userProfile?.name || currentUser?.displayName || "Chef";
  useEffect(() => {
    if (!currentUser) return;
    getRecentlyViewed(currentUser.uid).then((items) => setRecentViews(items)).catch((e) => console.warn(e));
    getSearchHistory(currentUser.uid).then((items) => setSearchHistory(items.slice(0, 5))).catch((e) => console.warn(e));
    fetchPopularRecipes(4, "healthy").then((recipes) => {
      setRecommendations(recipes);
      setLoadingRecs(false);
    }).catch(() => setLoadingRecs(false));
  }, [currentUser]);
  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!dashboardSearch.trim()) return;
    setSearchQuery(dashboardSearch.trim());
    executeSearch(void 0, dashboardSearch.trim());
    navigate("/explore");
  };
  const handleHistoryTagClick = (item) => {
    if (item.ingredients && item.ingredients.length > 0) {
      executeSearch(item.ingredients, item.query);
    } else {
      executeSearch(void 0, item.query);
    }
    navigate("/explore");
  };
  return <div id="dashboard-page-container" className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {
    /* Welcome Header with Image 2 Custom Background */
  }
        <div
          className="relative overflow-hidden rounded-3xl shadow-xl p-6 sm:p-9 text-white bg-cover bg-center border border-stone-800/80"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(28, 25, 23, 0.94) 0%, rgba(28, 25, 23, 0.86) 55%, rgba(28, 25, 23, 0.70) 100%), url('/assets/secondary-bg.jpg'), url('https://i.pinimg.com/736x/10/00/d6/1000d60ae0ec5b439b3f71325264fafa.jpg')`
          }}
        >
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SmartRecipe Personal Kitchen</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug drop-shadow-xs">
              {getGreeting()}, {displayName}! 👋
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
              What are we cooking today? Check your saved dishes or search by whatever is currently
              in your fridge.
            </p>

            {
    /* Quick search */
  }
            <form onSubmit={handleQuickSearch} className="flex gap-2 max-w-md pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  placeholder="Quick search dish or ingredient..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 text-stone-900 text-sm placeholder-stone-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 backdrop-blur-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {
    /* Stats Grid */
  }
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
    to="/favorites"
    className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-rose-200 hover:shadow-xs transition-all flex items-center justify-between group"
  >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Favorites
              </p>
              <h2 className="text-3xl font-black text-stone-900 mt-1">{favorites.length}</h2>
              <p className="text-xs text-rose-600 mt-1 font-medium group-hover:underline">
                View loved recipes →
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 fill-current" />
            </div>
          </Link>

          <Link
    to="/saved"
    className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-amber-200 hover:shadow-xs transition-all flex items-center justify-between group"
  >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Saved Vault
              </p>
              <h2 className="text-3xl font-black text-stone-900 mt-1">{savedRecipes.length}</h2>
              <p className="text-xs text-amber-600 mt-1 font-medium group-hover:underline">
                View saved recipes →
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
          </Link>

          <Link
    to="/history"
    className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all flex items-center justify-between group"
  >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Recently Viewed
              </p>
              <h2 className="text-3xl font-black text-stone-900 mt-1">{recentViews.length}</h2>
              <p className="text-xs text-indigo-600 mt-1 font-medium group-hover:underline">
                Browse view history →
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </Link>
        </div>

        {
    /* Recent Search Shortcuts */
  }
        {searchHistory.length > 0 && <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Recent Searches
              </span>
              <Link to="/history" className="text-xs text-amber-700 hover:underline font-semibold">
                Manage history
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, idx) => <button
    key={idx}
    onClick={() => handleHistoryTagClick(item)}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
  >
                  <Search className="w-3 h-3 text-stone-400" />
                  <span>{item.query || item.ingredients?.join(", ")}</span>
                </button>)}
            </div>
          </div>}

        {
    /* Saved Recipes Preview */
  }
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Recently Saved Recipes
              </h2>
            </div>
            <Link
    to="/saved"
    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
  >
              View all ({savedRecipes.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {savedRecipes.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedRecipes.slice(0, 4).map((recipe) => <RecipeCard key={recipe.id || recipe.recipeId} recipe={recipe} />)}
            </div> : <div className="p-8 rounded-2xl bg-white border border-stone-200/80 text-center space-y-3">
              <ChefHat className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-sm text-stone-600">You haven't saved any recipes yet.</p>
              <Link
    to="/explore"
    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
  >
                Discover recipes to save
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>}
        </section>

        {
    /* Recommended for you */
  }
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Curated Recommendations
              </h2>
            </div>
            <Link
    to="/explore"
    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
  >
              Explore more
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
          </div>
        </section>
      </div>
    </div>;
};
export {
  Dashboard
};
