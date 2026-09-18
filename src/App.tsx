import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { RecipeProvider } from './context/RecipeContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

// Pages
import { Home } from './pages/Home.tsx';
import { Explore } from './pages/Explore.tsx';
import { RecipeDetails } from './pages/RecipeDetails.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { SavedRecipes } from './pages/SavedRecipes.tsx';
import { Favorites } from './pages/Favorites.tsx';
import { History } from './pages/History.tsx';
import { Profile } from './pages/Profile.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { NotFound } from './pages/NotFound.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RecipeProvider>
          <div id="smartrecipe-app" className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved"
                  element={
                    <ProtectedRoute>
                      <SavedRecipes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </RecipeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
