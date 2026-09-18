import React, { useState } from 'react';
import { Bookmark, Search, Trash2, FileDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { downloadRecipePdf } from '../services/recipeService.ts';
import { EmptyState } from '../components/EmptyState.tsx';
import { stripHtml } from '../utils/helpers.ts';

export const SavedRecipes: React.FC = () => {
  const { savedRecipes, toggleSaveRecipe } = useRecipes();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredSaved = savedRecipes.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (recipe: any) => {
    setDownloadingId(recipe.recipeId);
    try {
      await downloadRecipePdf(recipe.recipeId, recipe);
    } catch {
      alert('Could not export PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRemove = async (recipe: any) => {
    if (confirm(`Remove "${recipe.title}" from your saved recipes?`)) {
      await toggleSaveRecipe(recipe);
    }
  };

  return (
    <div id="saved-recipes-page" className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">Saved Recipes</h1>
              <p className="text-xs text-stone-500">
                {savedRecipes.length} recipes bookmarked in your private collection
              </p>
            </div>
          </div>

          {/* Search within saved */}
          {savedRecipes.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved recipes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
        </div>

        {/* Content */}
        {savedRecipes.length === 0 ? (
          <EmptyState
            type="saved"
            title="No recipes saved yet 🍳"
            description="Find something delicious and save it for later when you are ready to cook."
            actionText="Explore Recipes"
            actionLink="/explore"
          />
        ) : filteredSaved.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-stone-600 text-sm">No saved recipes match "{searchTerm}".</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSaved.map((recipe) => (
              <div
                key={recipe.recipeId}
                id={`saved-card-${recipe.recipeId}`}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    <img
                      src={
                        recipe.image ||
                        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500'
                      }
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(recipe)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer shadow-xs"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-stone-900 text-base line-clamp-2 mb-2">
                      {recipe.title}
                    </h3>
                    {recipe.summary && (
                      <p className="text-xs text-stone-500 line-clamp-2">
                        {stripHtml(recipe.summary)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(recipe)}
                    disabled={downloadingId === recipe.recipeId}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    <span>{downloadingId === recipe.recipeId ? 'PDF...' : 'PDF'}</span>
                  </button>

                  <Link
                    to={`/recipe/${recipe.recipeId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Cook</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
