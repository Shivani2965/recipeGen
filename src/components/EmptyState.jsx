import { Link } from "react-router-dom";
import { ChefHat, Heart, Bookmark, Search, ArrowRight } from "lucide-react";
const EmptyState = ({
  type = "generic",
  title,
  description,
  actionText,
  actionLink,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case "favorites":
        return <Heart className="w-8 h-8 text-rose-500" />;
      case "saved":
        return <Bookmark className="w-8 h-8 text-amber-500" />;
      case "search":
        return <Search className="w-8 h-8 text-emerald-600" />;
      case "history":
        return <ChefHat className="w-8 h-8 text-indigo-500" />;
      default:
        return <ChefHat className="w-8 h-8 text-emerald-600" />;
    }
  };
  const defaultTitle = {
    favorites: "Your favorite recipes will appear here \u2764\uFE0F",
    saved: "No recipes saved yet \u{1F373}",
    search: "We couldn't find recipes matching those ingredients.",
    history: "No recently viewed recipes",
    generic: "Nothing found"
  }[type];
  const defaultDescription = {
    favorites: "Click the heart icon on any recipe card to keep your personal favorites here.",
    saved: "Find something delicious and save it for later when you are ready to cook.",
    search: "Try adjusting your ingredient combinations or loosening your filter criteria.",
    history: "Browse recipes and they will automatically show up in your viewing history.",
    generic: "Explore recipes and discover new culinary ideas for your kitchen."
  }[type];
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalActionText = actionText || "Explore Recipes";
  const finalActionLink = actionLink || "/explore";
  return <div
    id={`empty-state-${type}`}
    className="text-center py-16 px-6 max-w-md mx-auto flex flex-col items-center justify-center"
  >
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 shadow-xs border border-stone-200/60">
        {getIcon()}
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{finalTitle}</h3>
      <p className="text-sm text-stone-600 leading-relaxed mb-6">{finalDescription}</p>

      {onAction ? <button
    onClick={onAction}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
  >
          {finalActionText}
          <ArrowRight className="w-4 h-4" />
        </button> : <Link
    to={finalActionLink}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
  >
          {finalActionText}
          <ArrowRight className="w-4 h-4" />
        </Link>}
    </div>;
};
export {
  EmptyState
};
