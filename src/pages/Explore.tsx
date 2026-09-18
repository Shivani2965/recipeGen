import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Sparkles, ChefHat, RotateCcw } from 'lucide-react';
import { IngredientSelector } from '../components/IngredientSelector.tsx';
import { SearchBar } from '../components/SearchBar.tsx';
import { FilterPanel } from '../components/FilterPanel.tsx';
import { RecipeGrid } from '../components/RecipeGrid.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import { useRecipes } from '../context/RecipeContext.tsx';

export const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    clearIngredients,
    filters,
    setFilterValue,
    clearFilters,
    searchQuery,
    setSearchQuery,
    searchResults,
    totalResults,
    loading,
    error,
    executeSearch,
  } = useRecipes();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Check URL search parameters on mount
  useEffect(() => {
    const queryParam = searchParams.get('search');
    const tagsParam = searchParams.get('tags');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
    if (tagsParam) {
      if (tagsParam.includes('vegetarian')) setFilterValue('diet', 'vegetarian');
      if (tagsParam.includes('quick')) setFilterValue('maxReadyTime', 30);
      if (tagsParam.includes('italian')) setFilterValue('cuisine', 'italian');
    }
    // Execute initial search if ingredients exist and no search has been done
    if (searchResults.length === 0 && !loading) {
      executeSearch(
        undefined,
        queryParam || undefined,
        tagsParam ? { ...filters, ...(tagsParam.includes('quick') ? { maxReadyTime: 30 } : {}) } : undefined
      );
    }
  }, []);

  const handleSearchTrigger = () => {
    executeSearch();
  };

  return (
    <div id="explore-page-container" className="min-h-screen bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Heading & Summary */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                <ChefHat className="w-4 h-4" />
                Recipe Discovery Engine
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Explore Kitchen Creations
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Combine your fridge ingredients with dietary filters to find exact matching dishes.
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-2 lg:hidden w-full sm:w-auto">
              <button
                id="mobile-filter-btn"
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm font-semibold shadow-2xs hover:bg-stone-50 transition-colors w-full sm:w-auto cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span>Filters & Sorting</span>
              </button>
            </div>
          </div>

          {/* Search Inputs: Keyword & Ingredients */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5">
              <label htmlFor="search-input-field" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Search By Name or Keyword
              </label>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearchTrigger}
                placeholder="e.g. Garlic chicken, Creamy tomato pasta..."
              />
            </div>

            <div className="lg:col-span-7">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Ingredients In Your Kitchen
              </label>
              <IngredientSelector
                ingredients={ingredients}
                onAdd={addIngredient}
                onRemove={removeIngredient}
                onClear={clearIngredients}
                onSearch={handleSearchTrigger}
                isSearching={loading}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* Results Layout: Sidebar + Grid */}
        <div className="flex items-start gap-8">
          {/* Desktop Filter Panel */}
          <FilterPanel
            filters={filters}
            onChange={(key, val) => {
              setFilterValue(key, val);
              // Trigger search with updated filter
              executeSearch(undefined, undefined, { ...filters, [key]: val });
            }}
            onClear={() => {
              clearFilters();
              executeSearch(undefined, undefined, {
                cuisine: '',
                diet: '',
                mealType: '',
                maxReadyTime: undefined,
                sort: 'popularity',
              });
            }}
            isMobileDrawerOpen={mobileDrawerOpen}
            onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
            onApply={() => {
              setMobileDrawerOpen(false);
              executeSearch();
            }}
          />

          {/* Main Recipe Grid Area */}
          <main className="flex-1 w-full min-w-0">
            {/* Active Filters & Result Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stone-900">
                  {loading ? 'Finding recipes...' : `${totalResults} Recipes Found`}
                </span>
                {ingredients.length > 0 && (
                  <span className="text-xs text-stone-500 hidden sm:inline">
                    using {ingredients.join(', ')}
                  </span>
                )}
              </div>

              {/* Reset shortcut */}
              {(filters.cuisine || filters.diet || filters.mealType || filters.maxReadyTime) && (
                <button
                  type="button"
                  onClick={() => {
                    clearFilters();
                    executeSearch(undefined, undefined, {
                      cuisine: '',
                      diet: '',
                      mealType: '',
                      maxReadyTime: undefined,
                      sort: 'popularity',
                    });
                  }}
                  className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-emerald-800 font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear active filters
                </button>
              )}
            </div>

            {/* Error Message if any */}
            {error && (
              <ErrorMessage
                message={error}
                onRetry={handleSearchTrigger}
                showKeySetupHint={error.includes('Spoonacular API key')}
              />
            )}

            {/* Recipe Grid */}
            <RecipeGrid
              recipes={searchResults}
              loading={loading}
              skeletonCount={8}
              emptyType="search"
              emptyTitle="No recipes found with these ingredients"
              emptyDescription="Try removing one or two ingredients, or relaxing your dietary restrictions to see more recipe suggestions."
              onEmptyAction={() => {
                clearFilters();
                clearIngredients();
                setSearchQuery('');
              }}
              emptyActionText="Reset Search"
            />
          </main>
        </div>
      </div>
    </div>
  );
};
