import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase.ts';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAsGuestDemo,
  logoutUser,
  updateUserDisplayName,
} from '../services/authService.ts';
import { getUserProfile, UserProfileData } from '../services/firestoreService.ts';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (name: string, email: string, pass: string) => Promise<User>;
  loginGoogle: () => Promise<User>;
  loginGuest: () => Promise<User>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      try {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile);
      } catch {
        // Fallback to basic auth info
        setUserProfile({
          userId: auth.currentUser.uid,
          name: auth.currentUser.displayName || 'Chef',
          email: auth.currentUser.email || '',
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
            name: user.displayName || 'Chef',
            email: user.email || '',
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const user = await loginWithEmail(email, pass);
    await refreshProfile();
    return user;
  };

  const register = async (name: string, email: string, pass: string) => {
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

  const updateName = async (name: string) => {
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
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
