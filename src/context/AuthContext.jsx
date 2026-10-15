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

const AuthContext = createContext(undefined);

const GUEST_STORAGE_KEY = "smartrecipe_guest_user";

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile || {
          userId: auth.currentUser.uid,
          name: auth.currentUser.displayName || "Chef",
          email: auth.currentUser.email || ""
        });
      } catch {
        setUserProfile({
          userId: auth.currentUser.uid,
          name: auth.currentUser.displayName || "Chef",
          email: auth.currentUser.email || ""
        });
      }
    } else if (currentUser?.isLocalGuest) {
      setUserProfile({
        userId: currentUser.uid,
        name: currentUser.displayName || "Guest Chef",
        email: currentUser.email || ""
      });
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Real authenticated Firebase user (Google or Email)
        if (typeof window !== "undefined") {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        }
        setCurrentUser(firebaseUser);
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile || {
            userId: firebaseUser.uid,
            name: firebaseUser.displayName || "Chef",
            email: firebaseUser.email || ""
          });
        } catch {
          setUserProfile({
            userId: firebaseUser.uid,
            name: firebaseUser.displayName || "Chef",
            email: firebaseUser.email || ""
          });
        }
      } else {
        // No Firebase user, check if active local guest session exists
        let restoredGuest = null;
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem(GUEST_STORAGE_KEY);
            if (raw) {
              restoredGuest = JSON.parse(raw);
            }
          } catch {
            restoredGuest = null;
          }
        }

        if (restoredGuest) {
          setCurrentUser(restoredGuest);
          setUserProfile({
            userId: restoredGuest.uid,
            name: restoredGuest.displayName || "Guest Chef",
            email: restoredGuest.email || ""
          });
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, pass) => {
    const user = await loginWithEmail(email, pass);
    if (typeof window !== "undefined") {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
    await refreshProfile();
    return user;
  };

  const register = async (name, email, pass) => {
    const user = await registerWithEmail(name, email, pass);
    if (typeof window !== "undefined") {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
    await refreshProfile();
    return user;
  };

  const loginGoogle = async () => {
    const user = await loginWithGoogle();
    if (typeof window !== "undefined") {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
    await refreshProfile();
    return user;
  };

  const loginGuest = async () => {
    const user = await loginAsGuestDemo();
    if (user.isLocalGuest) {
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(user));
      }
      setCurrentUser(user);
      setUserProfile({
        userId: user.uid,
        name: user.displayName || "Guest Chef",
        email: user.email || ""
      });
    } else {
      await refreshProfile();
    }
    return user;
  };

  const logout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateName = async (name) => {
    if (currentUser?.isLocalGuest) {
      const updated = { ...currentUser, displayName: name };
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
      }
      setCurrentUser(updated);
      setUserProfile((prev) => ({ ...prev, name }));
      return;
    }
    await updateUserDisplayName(name);
    await refreshProfile();
  };

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
