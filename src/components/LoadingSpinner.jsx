const LoadingSpinner = ({
  size = "md",
  text = "Loading recipes...",
  className = ""
}) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4"
  };
  return <div id="loading-spinner-container" className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div
    className={`${sizeClasses[size]} border-emerald-600 border-t-transparent rounded-full animate-spin`}
    role="status"
    aria-label="loading"
  />
      {text && <p className="mt-3 text-sm font-medium text-stone-600">{text}</p>}
    </div>;
};
const RecipeCardSkeleton = () => {
  return <div
    id="recipe-card-skeleton"
    className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs animate-pulse flex flex-col"
  >
      <div className="w-full h-48 bg-stone-200" />
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-12 bg-stone-200 rounded-full" />
            <div className="h-4 w-16 bg-stone-200 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-stone-200 rounded-md mb-2" />
          <div className="h-4 w-1/2 bg-stone-100 rounded-md" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-200" />
            <div className="w-8 h-8 rounded-full bg-stone-200" />
          </div>
          <div className="h-8 w-24 rounded-lg bg-stone-200" />
        </div>
      </div>
    </div>;
};
export {
  LoadingSpinner,
  RecipeCardSkeleton
};
