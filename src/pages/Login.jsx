import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChefHat, Mail, Lock, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
const Login = () => {
  const { login, loginGoogle, loginGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const noticeMessage = location.state?.message;
  const returnTo = location.state?.from?.pathname || "/dashboard";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential" ? "Invalid email or password." : err.message || "Login failed. Please verify credentials."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginGoogle();
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };
  const handleGuestDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginGuest();
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to initialize demo guest session.");
    } finally {
      setLoading(false);
    }
  };
  return <div
    id="login-page-container"
    className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link
    to="/"
    className="inline-flex items-center gap-2 text-emerald-900 font-extrabold text-2xl"
  >
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <ChefHat className="w-6 h-6" />
          </div>
          <span>SmartRecipe</span>
        </Link>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Welcome back, Chef!</h1>
        <p className="text-sm text-stone-500">Sign in to your account to access your recipe vault</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md rounded-3xl border border-stone-200/80 space-y-6">
          {noticeMessage && <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
              {noticeMessage}
            </div>}

          {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {error}
            </div>}

          {
    /* Quick Demo Guest Button for Instant Evaluation */
  }
          <button
    id="demo-guest-login-btn"
    type="button"
    onClick={handleGuestDemo}
    disabled={loading}
    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-colors cursor-pointer"
  >
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Continue as Demo Guest (Instant Access)</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-400 font-semibold">Or with credentials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
    htmlFor="login-email-input"
    className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1"
  >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    id="login-email-input"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="chef@smartrecipe.com"
    required
    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
  />
              </div>
            </div>

            <div>
              <label
    htmlFor="login-password-input"
    className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1"
  >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    id="login-password-input"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    required
    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
  />
              </div>
            </div>

            <button
    id="login-submit-btn"
    type="submit"
    disabled={loading}
    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
  >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {
    /* Google Auth */
  }
          <div className="space-y-3 pt-2">
            <button
    id="google-login-btn"
    type="button"
    onClick={handleGoogleLogin}
    disabled={loading}
    className="w-full py-2.5 px-4 border border-stone-300 rounded-xl shadow-2xs bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
  >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
    fill="#4285F4"
    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
  />
                <path
    fill="#34A853"
    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
  />
                <path
    fill="#FBBC05"
    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
  />
                <path
    fill="#EA4335"
    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
  />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-stone-500">
              Don't have an account yet?{" "}
              <Link to="/register" className="font-bold text-emerald-700 hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export {
  Login
};
