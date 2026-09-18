import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RecipeProvider } from "./context/RecipeContext.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Home } from "./pages/Home.jsx";
import { Explore } from "./pages/Explore.jsx";
import { RecipeDetails } from "./pages/RecipeDetails.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { SavedRecipes } from "./pages/SavedRecipes.jsx";
import { Favorites } from "./pages/Favorites.jsx";
import { History } from "./pages/History.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { NotFound } from "./pages/NotFound.jsx";
function App() {
  return <BrowserRouter>
      <AuthProvider>
        <RecipeProvider>
          <div id="smartrecipe-app" className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {
    /* Public routes */
  }
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {
    /* Protected routes */
  }
                <Route
    path="/dashboard"
    element={<ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>}
  />
                <Route
    path="/saved"
    element={<ProtectedRoute>
                      <SavedRecipes />
                    </ProtectedRoute>}
  />
                <Route
    path="/favorites"
    element={<ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>}
  />
                <Route
    path="/history"
    element={<ProtectedRoute>
                      <History />
                    </ProtectedRoute>}
  />
                <Route
    path="/profile"
    element={<ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>}
  />

                {
    /* Fallback 404 */
  }
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RecipeProvider>
      </AuthProvider>
    </BrowserRouter>;
}
export {
  App as default
};
