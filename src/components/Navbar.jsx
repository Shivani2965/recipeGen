import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChefHat,
  Search,
  Heart,
  Bookmark,
  Clock,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRecipes } from "../context/RecipeContext.jsx";
const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { favorites, savedRecipes } = useRecipes();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  const navItemClasses = ({ isActive }) => `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "bg-emerald-100/70 text-emerald-900 font-semibold" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"}`;
  return <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {
    /* Brand logo */
  }
          <div className="flex items-center gap-8">
            <Link
    to="/"
    id="brand-logo-link"
    className="flex items-center gap-2 text-emerald-900 font-black tracking-tight text-xl group"
  >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-stone-900">
                Smart<span className="text-emerald-700">Recipe</span>
              </span>
            </Link>

            {
    /* Desktop main links */
  }
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/" end className={navItemClasses}>
                Home
              </NavLink>
              <NavLink to="/explore" className={navItemClasses}>
                Explore
              </NavLink>
              {currentUser && <>
                  <NavLink to="/dashboard" className={navItemClasses}>
                    <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                    Dashboard
                  </NavLink>
                  <NavLink to="/favorites" className={navItemClasses}>
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Favorites</span>
                    {favorites.length > 0 && <span className="ml-0.5 px-1.5 py-0.2 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-full">
                        {favorites.length}
                      </span>}
                  </NavLink>
                  <NavLink to="/saved" className={navItemClasses}>
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <span>Saved</span>
                    {savedRecipes.length > 0 && <span className="ml-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full">
                        {savedRecipes.length}
                      </span>}
                  </NavLink>
                  <NavLink to="/history" className={navItemClasses}>
                    <Clock className="w-4 h-4 text-stone-500" />
                    History
                  </NavLink>
                </>}
            </nav>
          </div>

          {
    /* Desktop Right Side Auth / Actions */
  }
          <div className="hidden md:flex items-center gap-3">
            <Link
    to="/explore"
    className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
    aria-label="Explore search"
    title="Search recipes"
  >
              <Search className="w-4 h-4" />
            </Link>

            {currentUser ? <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <Link
    to="/profile"
    id="profile-nav-btn"
    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-stone-100 text-stone-800 text-sm font-medium transition-colors"
  >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                    {userProfile?.photoURL ? <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : userProfile?.name?.charAt(0) || currentUser.displayName?.charAt(0) || <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="max-w-[100px] truncate text-stone-800 font-medium">
                    {userProfile?.name || currentUser.displayName || "Chef"}
                  </span>
                </Link>
                <button
    id="navbar-logout-btn"
    onClick={handleLogout}
    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
    title="Sign out"
    aria-label="Sign out"
  >
                  <LogOut className="w-4 h-4" />
                </button>
              </div> : <div className="flex items-center gap-2">
                <Link
    to="/login"
    id="nav-login-btn"
    className="px-4 py-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 text-sm font-semibold transition-colors"
  >
                  Log in
                </Link>
                <Link
    to="/register"
    id="nav-register-btn"
    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-2xs transition-colors"
  >
                  <Sparkles className="w-3.5 h-3.5" />
                  Sign Up
                </Link>
              </div>}
          </div>

          {
    /* Mobile menu hamburger button */
  }
          <div className="flex items-center gap-2 md:hidden">
            <button
    id="mobile-menu-toggle-btn"
    type="button"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 focus:outline-hidden"
    aria-label="Toggle navigation menu"
  >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {
    /* Mobile Drawer Menu */
  }
      {mobileMenuOpen && <div id="mobile-navigation-drawer" className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            <Link
    to="/"
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
  >
              Home
            </Link>
            <Link
    to="/explore"
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
  >
              Explore Recipes
            </Link>
            {currentUser && <>
                <Link
    to="/dashboard"
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 rounded-xl text-sm font-medium text-emerald-800 hover:bg-emerald-50 flex items-center gap-2"
  >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
    to="/favorites"
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-between"
  >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    Favorites
                  </span>
                  {favorites.length > 0 && <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                      {favorites.length}
                    </span>}
                </Link>
                <Link
    to="/saved"
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-between"
  >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    Saved Recipes
                  </span>
                  {savedRecipes.length > 0 && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                      {savedRecipes.length}
                    </span>}
                </Link>
                <Link
    to="/history"
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 flex items-center gap-2"
  >
                  <Clock className="w-4 h-4 text-stone-500" />
                  History & Searches
                </Link>
                <Link
    to="/profile"
    onClick={() => setMobileMenuOpen(false)}
    className="px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 flex items-center gap-2"
  >
                  <User className="w-4 h-4 text-stone-500" />
                  My Profile
                </Link>
              </>}
          </div>

          <div className="pt-3 border-t border-stone-200">
            {currentUser ? <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Signed in as <strong>{userProfile?.name || currentUser.displayName || currentUser.email}</strong>
                </span>
                <button
    onClick={() => {
      handleLogout();
      setMobileMenuOpen(false);
    }}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold cursor-pointer"
  >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div> : <div className="grid grid-cols-2 gap-2">
                <Link
    to="/login"
    onClick={() => setMobileMenuOpen(false)}
    className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-800 text-center text-sm font-semibold"
  >
                  Log in
                </Link>
                <Link
    to="/register"
    onClick={() => setMobileMenuOpen(false)}
    className="w-full py-2.5 rounded-xl bg-emerald-700 text-white text-center text-sm font-semibold"
  >
                  Sign Up
                </Link>
              </div>}
          </div>
        </div>}
    </header>;
};
export {
  Navbar
};
