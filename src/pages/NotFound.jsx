import { Link } from "react-router-dom";
import { ChefHat, ArrowLeft } from "lucide-react";
const NotFound = () => {
  return <div
    id="not-found-page"
    className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center"
  >
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 text-emerald-700">
        <ChefHat className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-stone-900 tracking-tight mb-2">404 - Recipe Not Found</h1>
      <p className="text-stone-600 text-sm max-w-sm mb-6 leading-relaxed">
        The culinary page you are searching for has moved, or does not exist in our kitchen library.
      </p>
      <Link
    to="/"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors"
  >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </Link>
    </div>;
};
export {
  NotFound
};
