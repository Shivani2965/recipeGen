import { Filter, X, RotateCcw } from "lucide-react";
const CUISINES = [
  "Italian",
  "Mexican",
  "Asian",
  "American",
  "Mediterranean",
  "Indian",
  "French",
  "Greek",
  "Japanese",
  "Thai",
  "Spanish"
];
const DIETS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "ketogenic", label: "Keto" },
  { id: "paleo", label: "Paleo" }
];
const MEAL_TYPES = [
  { id: "main course", label: "Main Course" },
  { id: "breakfast", label: "Breakfast" },
  { id: "soup", label: "Soup & Stew" },
  { id: "salad", label: "Salad" },
  { id: "dessert", label: "Dessert" },
  { id: "snack", label: "Snack / Appetizer" }
];
const TIME_OPTIONS = [
  { label: "Any time", value: void 0 },
  { label: "Under 20 mins", value: 20 },
  { label: "Under 30 mins", value: 30 },
  { label: "Under 45 mins", value: 45 },
  { label: "Under 60 mins", value: 60 }
];
const SORT_OPTIONS = [
  { label: "Most Popular", value: "popularity" },
  { label: "Health Score", value: "healthiness" },
  { label: "Quickest to Cook", value: "time" },
  { label: "Calorie Count", value: "calories" }
];
const FilterPanel = ({
  filters,
  onChange,
  onClear,
  onApply,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer
}) => {
  const content = <div className="space-y-6 text-stone-800">
      {
    /* Header */
  }
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-base text-stone-900">Filter Recipes</h3>
        </div>
        <button
    type="button"
    onClick={onClear}
    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
  >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset all
        </button>
      </div>

      {
    /* Sort Options */
  }
      <div>
        <label htmlFor="filter-sort-select" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Sort By
        </label>
        <select
    id="filter-sort-select"
    value={filters.sort || "popularity"}
    onChange={(e) => onChange("sort", e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
  >
          {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>)}
        </select>
      </div>

      {
    /* Cooking Time */
  }
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Max Ready Time
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {TIME_OPTIONS.map((time) => {
    const isSelected = filters.maxReadyTime === time.value;
    return <button
      key={time.label}
      type="button"
      onClick={() => onChange("maxReadyTime", isSelected ? void 0 : time.value)}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${isSelected ? "bg-emerald-700 border-emerald-700 text-white shadow-2xs" : "bg-white border-stone-200 text-stone-700 hover:bg-stone-50"}`}
    >
                {time.label}
              </button>;
  })}
        </div>
      </div>

      {
    /* Cuisine */
  }
      <div>
        <label htmlFor="filter-cuisine-select" className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Cuisine
        </label>
        <select
    id="filter-cuisine-select"
    value={filters.cuisine || ""}
    onChange={(e) => onChange("cuisine", e.target.value)}
    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
  >
          <option value="">All Cuisines</option>
          {CUISINES.map((c) => <option key={c} value={c.toLowerCase()}>
              {c}
            </option>)}
        </select>
      </div>

      {
    /* Dietary preferences */
  }
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Dietary Restrictions
        </label>
        <div className="flex flex-wrap gap-1.5">
          {DIETS.map((d) => {
    const isSelected = filters.diet === d.id;
    return <button
      key={d.id}
      type="button"
      onClick={() => onChange("diet", isSelected ? "" : d.id)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${isSelected ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"}`}
    >
                {d.label}
              </button>;
  })}
        </div>
      </div>

      {
    /* Meal Types */
  }
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Meal Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {MEAL_TYPES.map((m) => {
    const isSelected = filters.mealType === m.id;
    return <button
      key={m.id}
      type="button"
      onClick={() => onChange("mealType", isSelected ? "" : m.id)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${isSelected ? "bg-amber-100 border-amber-300 text-amber-900 font-semibold" : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"}`}
    >
                {m.label}
              </button>;
  })}
        </div>
      </div>

      {
    /* Mobile apply button */
  }
      {onApply && <div className="pt-4 border-t border-stone-200 lg:hidden">
          <button
    type="button"
    onClick={onApply}
    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors cursor-pointer"
  >
            Apply Filters
          </button>
        </div>}
    </div>;
  return <>
      {
    /* Desktop Sidebar */
  }
      <aside
    id="desktop-filter-sidebar"
    className="hidden lg:block w-72 shrink-0 p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs h-fit sticky top-24"
  >
        {content}
      </aside>

      {
    /* Mobile Drawer */
  }
      {isMobileDrawerOpen && <div
    id="mobile-filter-drawer-backdrop"
    className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex justify-end lg:hidden"
    onClick={onCloseMobileDrawer}
  >
          <div
    id="mobile-filter-drawer"
    className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between animate-slideLeft"
    onClick={(e) => e.stopPropagation()}
  >
            <div>
              <div className="flex justify-end mb-2">
                <button
    type="button"
    onClick={onCloseMobileDrawer}
    className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
    aria-label="Close filters"
  >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>
          </div>
        </div>}
    </>;
};
export {
  FilterPanel
};
