import { Link } from "react-router-dom";
import { ChefHat, Heart, ExternalLink } from "lucide-react";
const Footer = () => {
  return <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          {
    /* Brand Col */
  }
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                Smart<span className="text-emerald-500">Recipe</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Turn what's in your kitchen into delicious homemade dishes. Discover recipes by
              available ingredients, save personal collections, and export clean PDF recipe cards.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-stone-500">
              <span>Powered by Spoonacular API</span>
              <span>•</span>
              <span>Firebase Firestore</span>
              <span>•</span>
              <span>Node.js Express</span>
            </div>
          </div>

          {
    /* Quick Links */
  }
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition-colors">
                  Ingredient Discovery
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Cook Dashboard
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-emerald-400 transition-colors">
                  Saved Recipes
                </Link>
              </li>
            </ul>
          </div>

          {
    /* API Info */
  }
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
              Architecture & API
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center gap-1.5">
                <span>Frontend: React + Vite</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Backend: Express REST API</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Database: Firebase Firestore</span>
              </li>
              <li>
                <a
    href="https://spoonacular.com/food-api"
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-medium"
  >
                  Spoonacular Documentation
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {(/* @__PURE__ */ new Date()).getFullYear()} SmartRecipe Platform. Built with modern full-stack web standards.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for home cooks and food enthusiasts</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline ml-1" />
          </div>
        </div>
      </div>
    </footer>;
};
export {
  Footer
};
