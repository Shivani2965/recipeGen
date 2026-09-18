import React, { useState } from 'react';
import { Plus, X, Sparkles, ChefHat } from 'lucide-react';

interface IngredientSelectorProps {
  ingredients: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  onClear?: () => void;
  onSearch?: () => void;
  isSearching?: boolean;
  compact?: boolean;
}

const COMMON_PANTRY = [
  'chicken',
  'garlic',
  'onion',
  'tomato',
  'eggs',
  'cheese',
  'pasta',
  'rice',
  'lemon',
  'potatoes',
  'spinach',
  'butter',
];

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  ingredients,
  onAdd,
  onRemove,
  onClear,
  onSearch,
  isSearching = false,
  compact = false,
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    if (!inputVal.trim()) return;
    onAdd(inputVal.trim());
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div id="ingredient-selector-component" className="w-full">
      <div className="flex flex-col gap-3">
        {/* Input bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="ingredient-input-field"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an ingredient (e.g. chicken, garlic, tomato)..."
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm transition-all shadow-2xs"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            id="add-ingredient-btn"
            type="button"
            onClick={handleAdd}
            disabled={!inputVal.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
          {onSearch && (
            <button
              id="find-recipes-submit-btn"
              type="button"
              onClick={onSearch}
              disabled={ingredients.length === 0 || isSearching}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <ChefHat className="w-4 h-4" />
              <span>{isSearching ? 'Finding...' : 'Find Recipes'}</span>
            </button>
          )}
        </div>

        {/* Selected ingredients pills */}
        {ingredients.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-stone-500 mr-1">In your kitchen:</span>
            {ingredients.map((ing) => (
              <span
                key={ing}
                id={`ingredient-tag-${ing}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 text-xs font-semibold tracking-wide animate-fadeIn"
              >
                {ing}
                <button
                  type="button"
                  onClick={() => onRemove(ing)}
                  className="hover:bg-emerald-200 text-emerald-800 rounded-full p-0.5 transition-colors cursor-pointer"
                  aria-label={`Remove ${ing}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {onClear && ingredients.length > 1 && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs text-stone-400 hover:text-rose-600 underline font-medium ml-1 cursor-pointer transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic">No ingredients added yet. Add ingredients from your kitchen above.</p>
        )}

        {/* Pantry quick suggestions */}
        {!compact && (
          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick add pantry staples:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PANTRY.filter((item) => !ingredients.includes(item)).slice(0, 8).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onAdd(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-stone-500" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
