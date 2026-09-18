import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase.js";
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAsGuestDemo,
  logoutUser,
  updateUserDisplayName
} from "../services/authService.js";
import { getUserProfile } from "../services/firestoreService.js";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshProfile = async () => {
    if (auth.currentUser) {
      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile);
      } catch {
        setUserProfile({
          userId: auth.currentUser.uid,
          name: auth.currentUser.displayName || "Chef",
          email: auth.currentUser.email || ""
        });
      }
    } else {
      setUserProfile(null);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch {
          setUserProfile({
            userId: user.uid,
            name: user.displayName || "Chef",
            email: user.email || ""
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const login = async (email, pass) => {
    const user = await loginWithEmail(email, pass);
    await refreshProfile();
    return user;
  };
  const register = async (name, email, pass) => {
    const user = await registerWithEmail(name, email, pass);
    await refreshProfile();
    return user;
  };
  const loginGoogle = async () => {
    const user = await loginWithGoogle();
    await refreshProfile();
    return user;
  };
  const loginGuest = async () => {
    const user = await loginAsGuestDemo();
    await refreshProfile();
    return user;
  };
  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };
  const updateName = async (name) => {
    await updateUserDisplayName(name);
    await refreshProfile();
  };
  return <AuthContext.Provider
    value={{
      currentUser,
      userProfile,
      loading,
      login,
      register,
      loginGoogle,
      loginGuest,
      logout,
      updateName,
      refreshProfile
    }}
  >
      {children}
    </AuthContext.Provider>;
};
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export {
  AuthProvider,
  useAuth
};
