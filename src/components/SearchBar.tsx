import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search by recipe name or keyword (e.g. Creamy pasta, Chicken curry)...',
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div id="recipe-search-bar" className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 text-stone-400 pointer-events-none">
        <Search className="w-5 h-5" />
      </div>
      <input
        id="search-input-field"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-11 pr-24 py-3.5 rounded-2xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm transition-all shadow-xs"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-16 text-stone-400 hover:text-stone-600 p-1"
          aria-label="Clear search text"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        id="search-submit-btn"
        type="button"
        onClick={onSearch}
        className="absolute right-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
      >
        Search
      </button>
    </div>
  );
};
