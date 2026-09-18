import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Trash2, Search, ArrowRight, Eye, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useRecipes } from '../context/RecipeContext.tsx';
import {
  getSearchHistory,
  clearSearchHistory,
  getRecentlyViewed,
  SearchHistoryItem,
  RecentlyViewedItem,
} from '../services/firestoreService.ts';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';

export const History: React.FC = () => {
  const { currentUser } = useAuth();
  const { executeSearch } = useRecipes();
  const navigate = useNavigate();

  const [searches, setSearches] = useState<SearchHistoryItem[]>([]);
  const [views, setViews] = useState<RecentlyViewedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    Promise.all([getSearchHistory(currentUser.uid), getRecentlyViewed(currentUser.uid)])
      .then(([sList, vList]) => {
        setSearches(sList);
        setViews(vList);
        setLoading(false);
      })
      .catch((e) => {
        console.warn(e);
        setLoading(false);
      });
  }, [currentUser]);

  const handleClearSearches = async () => {
    if (!currentUser) return;
    if (confirm('Are you sure you want to clear your search history?')) {
      setClearing(true);
      try {
        await clearSearchHistory(currentUser.uid);
        setSearches([]);
      } catch (err) {
        console.error('Failed to clear search history:', err);
      } finally {
        setClearing(false);
      }
    }
  };

  const handleRerunSearch = (item: SearchHistoryItem) => {
    if (item.ingredients && item.ingredients.length > 0) {
      executeSearch(item.ingredients, item.query);
    } else {
      executeSearch(undefined, item.query);
    }
    navigate('/explore');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading your culinary history..." />
      </div>
    );
  }

  return (
    <div id="history-page" className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                History & Activity
              </h1>
              <p className="text-xs text-stone-500">
                Track your kitchen searches and recently examined recipe cards
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Search History */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold text-stone-900">Recent Kitchen Searches</h2>
            </div>
            {searches.length > 0 && (
              <button
                type="button"
                onClick={handleClearSearches}
                disabled={clearing}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{clearing ? 'Clearing...' : 'Clear searches'}</span>
              </button>
            )}
          </div>

          {searches.length === 0 ? (
            <p className="text-sm text-stone-500 italic py-4">No search history recorded yet.</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {searches.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                      <ChefHat className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900 group-hover:text-emerald-800">
                        {item.query || item.ingredients?.join(', ')}
                      </p>
                      {item.ingredients && item.ingredients.length > 0 && (
                        <p className="text-xs text-stone-400">
                          Ingredients: {item.ingredients.join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRerunSearch(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span>Search Again</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Recently Viewed Recipes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-stone-100">
            <Eye className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-stone-900">Recently Viewed Recipes</h2>
          </div>

          {views.length === 0 ? (
            <p className="text-sm text-stone-500 italic py-4">
              No viewed recipes yet. Click any recipe card to review details here.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {views.map((item) => (
                <Link
                  key={item.recipeId}
                  to={`/recipe/${item.recipeId}`}
                  className="group bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col"
                >
                  <div className="aspect-16/10 bg-stone-200 overflow-hidden">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-xs font-bold text-stone-900 line-clamp-2 group-hover:text-emerald-700">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
