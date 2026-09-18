import { useState, useEffect } from "react";
import { Mail, Calendar, Heart, Bookmark, LogOut, Check, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRecipes } from "../context/RecipeContext.jsx";
const Profile = () => {
  const { currentUser, userProfile, updateName, logout } = useAuth();
  const { favorites, savedRecipes } = useRecipes();
  const [nameInput, setNameInput] = useState(
    userProfile?.name || currentUser?.displayName || "Chef"
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (userProfile?.name || currentUser?.displayName) {
      setNameInput(userProfile?.name || currentUser?.displayName || "Chef");
    }
  }, [userProfile, currentUser]);
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);
    try {
      await updateName(nameInput.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3e3);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile name.");
    } finally {
      setSaving(false);
    }
  };
  return <div id="profile-page" className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {
    /* Profile Header Card */
  }
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-200 flex items-center justify-center font-black text-2xl uppercase shadow-xs overflow-hidden">
              {userProfile?.photoURL ? <img
    src={userProfile.photoURL}
    alt="Profile"
    className="w-full h-full object-cover"
  /> : nameInput.charAt(0) || "C"}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                {userProfile?.name || currentUser?.displayName || "Smart Chef"}
              </h1>
              <p className="text-sm text-stone-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-stone-400" />
                <span>{currentUser?.email || "Anonymous Guest Session"}</span>
              </p>
              <p className="text-xs text-stone-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Member since{" "}
                  {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : "Today"}
                </span>
              </p>
            </div>

            <button
    id="profile-logout-btn"
    type="button"
    onClick={() => logout()}
    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
  >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>

          {
    /* Quick counters */
  }
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-stone-100">
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center gap-3">
              <Heart className="w-6 h-6 text-rose-500 fill-current" />
              <div>
                <p className="text-xs font-semibold text-rose-800">Favorite Recipes</p>
                <p className="text-xl font-black text-rose-950">{favorites.length}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-amber-500 fill-current" />
              <div>
                <p className="text-xs font-semibold text-amber-800">Saved in Vault</p>
                <p className="text-xl font-black text-amber-950">{savedRecipes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {
    /* Update Profile Form */
  }
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-base text-stone-900">Account Preferences</h2>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 max-w-md">
            <div>
              <label
    htmlFor="profile-name-input"
    className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5"
  >
                Display Name
              </label>
              <input
    id="profile-name-input"
    type="text"
    value={nameInput}
    onChange={(e) => setNameInput(e.target.value)}
    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
    required
  />
            </div>

            {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}

            {saveSuccess && <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Profile updated successfully!
              </p>}

            <button
    id="save-profile-btn"
    type="submit"
    disabled={saving}
    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
  >
              {saving ? "Saving changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>;
};
export {
  Profile
};
