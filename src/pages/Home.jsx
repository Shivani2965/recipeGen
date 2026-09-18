import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  CheckCircle2,
  ChefHat,
  Search
} from "lucide-react";
import { IngredientSelector } from "../components/IngredientSelector.jsx";
import { RecipeGrid } from "../components/RecipeGrid.jsx";
import { ErrorMessage } from "../components/ErrorMessage.jsx";
import { useRecipes } from "../context/RecipeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchPopularRecipes } from "../services/recipeService.js";
import { getRecentlyViewed } from "../services/firestoreService.js";
const CATEGORIES = [
  { name: "Quick 30-Min", query: "", tags: "quick", icon: "\u23F1\uFE0F" },
  { name: "Chicken Dishes", query: "chicken", tags: "", icon: "\u{1F357}" },
  { name: "Italian Pasta", query: "pasta", tags: "italian", icon: "\u{1F35D}" },
  { name: "Vegetarian", query: "", tags: "vegetarian", icon: "\u{1F957}" },
  { name: "Healthy Salads", query: "salad", tags: "healthy", icon: "\u{1F951}" },
  { name: "Comfort Soups", query: "soup", tags: "", icon: "\u{1F372}" }
];
const Home = () => {
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    executeSearch,
    hasApiKey
  } = useRecipes();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);
  const [recentViews, setRecentViews] = useState([]);
  useEffect(() => {
    let mounted = true;
    setLoadingFeatured(true);
    fetchPopularRecipes(8).then((recipes) => {
      if (mounted) {
        setFeaturedRecipes(recipes);
        setLoadingFeatured(false);
      }
    }).catch((err) => {
      if (mounted) {
        setFeaturedError(err.response?.data?.message || err.message);
        setLoadingFeatured(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (currentUser) {
      getRecentlyViewed(currentUser.uid).then((items) => setRecentViews(items)).catch((e) => console.warn("Could not fetch recent views:", e));
    } else {
      setRecentViews([]);
    }
  }, [currentUser]);
  const handleHeroSearch = async () => {
    await executeSearch();
    navigate("/explore");
  };
  const handleCategoryClick = (cat) => {
    navigate(`/explore?search=${encodeURIComponent(cat.query || cat.name)}&tags=${cat.tags}`);
  };
  return <div id="home-page-container" className="min-h-screen bg-stone-50 text-stone-900">
      {
    /* Hero Section */
  }
      <section className="relative overflow-hidden bg-linear-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/70 border border-emerald-600/40 text-emerald-200 text-xs font-semibold backdrop-blur-xs shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Ingredient-Based Cooking</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Turn the ingredients you have into{" "}
            <span className="text-emerald-400">something delicious.</span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover recipes based on what's already in your kitchen. No grocery runs, no wasted
            food, just hearty homemade meals.
          </p>

          {
    /* Large Ingredient Search Box */
  }
          <div className="mt-8 bg-white/98 text-stone-900 p-6 rounded-3xl shadow-xl border border-stone-100 max-w-3xl mx-auto text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-700" />
                <h2 className="font-bold text-base text-stone-900">What's in your kitchen?</h2>
              </div>
              <span className="text-xs text-stone-500 hidden sm:inline">Add multiple ingredients</span>
            </div>

            <IngredientSelector
    ingredients={ingredients}
    onAdd={addIngredient}
    onRemove={removeIngredient}
    onClear={clearIngredients}
    onSearch={handleHeroSearch}
    compact={false}
  />
          </div>
        </div>
      </section>

      {
    /* API Key Banner if not set */
  }
      {!hasApiKey && <div className="max-w-4xl mx-auto px-4 pt-6">
          <ErrorMessage
    message="Spoonacular API key is not configured. Add SPOONACULAR_API_KEY in your environment or Settings to discover live recipes."
    showKeySetupHint={true}
  />
        </div>}

      {
    /* Popular Categories */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">Popular Categories</h2>
            <p className="text-sm text-stone-500">Curated cooking themes for every craving</p>
          </div>
          <Link
    to="/explore"
    className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
  >
            Explore all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => <button
    key={cat.name}
    type="button"
    onClick={() => handleCategoryClick(cat)}
    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-emerald-500 hover:shadow-md transition-all group text-center cursor-pointer"
  >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="font-bold text-xs text-stone-800 group-hover:text-emerald-800">
                {cat.name}
              </span>
            </button>)}
        </div>
      </section>

      {
    /* Recently Viewed (When Logged In) */
  }
      {currentUser && recentViews.length > 0 && <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <div>
                <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                  Recently Viewed
                </h2>
                <p className="text-sm text-stone-500">Pick up where you left off</p>
              </div>
            </div>
            <Link
    to="/history"
    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
  >
              View full history
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentViews.slice(0, 6).map((item) => <Link
    key={item.recipeId}
    to={`/recipe/${item.recipeId}`}
    className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all"
  >
                <div className="aspect-square bg-stone-100 overflow-hidden">
                  <img
    src={item.image || "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300"}
    alt={item.title}
    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
  />
                </div>
                <div className="p-2.5">
                  <h4 className="text-xs font-bold text-stone-800 line-clamp-1 group-hover:text-emerald-700">
                    {item.title}
                  </h4>
                </div>
              </Link>)}
          </div>
        </section>}

      {
    /* Featured / Recommended Recipes */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              Chef's Picks
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Trending & Featured Recipes
            </h2>
          </div>
          <Link
    to="/explore"
    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-2xs"
  >
            <Search className="w-3.5 h-3.5" />
            Explore More
          </Link>
        </div>

        {featuredError ? <ErrorMessage
    message={featuredError}
    onRetry={() => {
      setFeaturedError(null);
      setLoadingFeatured(true);
      fetchPopularRecipes(8).then((r) => {
        setFeaturedRecipes(r);
        setLoadingFeatured(false);
      }).catch((e) => {
        setFeaturedError(e.message);
        setLoadingFeatured(false);
      });
    }}
  /> : <RecipeGrid
    recipes={featuredRecipes}
    loading={loadingFeatured}
    skeletonCount={8}
    emptyTitle="No featured recipes available"
    emptyDescription="Ensure your Spoonacular API key is active to view live trending recipes."
  />}
      </section>

      {
    /* "What's in your kitchen?" Feature Value Prop */
  }
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16 px-4 sm:px-6 lg:px-8 my-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Why SmartRecipe?
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight mt-1 mb-3">
              Cooking simplified in three easy steps
            </h2>
            <p className="text-sm text-stone-600">
              Transform random pantry ingredients into restaurant-quality dinners without stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="font-bold text-lg text-stone-900">List Your Ingredients</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Add chicken, garlic, tomatoes, or whatever is sitting in your fridge and pantry.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="font-bold text-lg text-stone-900">Filter & Customize</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Filter by prep time, vegetarian, gluten-free, cuisine, and calories to match your diet.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="font-bold text-lg text-stone-900">Cook & Export PDF</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Follow step-by-step instructions, save your favorites, and download clean PDFs for offline cooking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {
    /* Call to Action for Logged Out Users */
  }
      {!currentUser && <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-linear-to-br from-emerald-800 to-stone-900 text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Create your personal recipe vault
              </h3>
              <p className="text-emerald-100 text-sm max-w-md">
                Sign up for free to bookmark your favorite dishes, save recipe collections, track
                what you cook, and export PDFs anytime.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-emerald-200">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Cloud Saved Recipes
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Instant PDF Downloads
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Personal Cook Dashboard
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
    to="/register"
    className="px-6 py-3.5 rounded-xl bg-white text-emerald-950 font-bold text-sm text-center hover:bg-emerald-50 transition-colors shadow-sm"
  >
                Sign Up Free
              </Link>
              <Link
    to="/login"
    className="px-6 py-3.5 rounded-xl bg-emerald-900/60 border border-emerald-700 text-white font-bold text-sm text-center hover:bg-emerald-900 transition-colors"
  >
                Log In
              </Link>
            </div>
          </div>
        </section>}
    </div>;
};
export {
  Home
};
