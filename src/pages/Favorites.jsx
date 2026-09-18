import { useState } from "react";
import { Heart, Search } from "lucide-react";
import { useRecipes } from "../context/RecipeContext.jsx";
import { RecipeCard } from "../components/RecipeCard.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
const Favorites = () => {
  const { favorites } = useRecipes();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredFavorites = favorites.filter(
    (f) => (f.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  return <div id="favorites-page" className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {
    /* Header */
  }
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Favorite Recipes</h1>
              <p className="text-xs text-stone-500">
                {favorites.length} recipes marked with love in your collection
              </p>
            </div>
          </div>

          {
    /* Search favorites */
  }
          {favorites.length > 0 && <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search favorite recipes..."
    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
  />
            </div>}
        </div>

        {
    /* List */
  }
        {favorites.length === 0 ? <EmptyState
    type="favorites"
    title="Your favorite recipes will appear here ❤️"
    description="Click the heart icon on any recipe card while browsing to add it to your favorites."
    actionText="Discover Delicious Recipes"
    actionLink="/explore"
  /> : filteredFavorites.length === 0 ? <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-stone-600 text-sm">No favorites match "{searchTerm}".</p>
            <button
    onClick={() => setSearchTerm("")}
    className="mt-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
  >
              Clear search filter
            </button>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((fav) => <RecipeCard key={fav.recipeId} recipe={{ ...fav, id: fav.recipeId }} />)}
          </div>}
      </div>
    </div>;
};
export {
  Favorites
};
