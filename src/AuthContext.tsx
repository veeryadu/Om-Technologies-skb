import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle,
  loginWithEmail,
  signupWithEmail,
  resetPassword,
  logOut,
  testFirestoreConnection,
} from './firebase';

export interface UserProfileData {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role?: string;
  createdAt?: any;
  lastLogin?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  loginWithGoogleProvider: () => Promise<User>;
  login: (email: string, pass: string) => Promise<User>;
  signup: (email: string, pass: string, name?: string) => Promise<User>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'signup' | 'forgot') => void;
  currentView: 'home' | 'dashboard';
  setCurrentView: (view: 'home' | 'dashboard') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  loginWithGoogleProvider: async () => { throw new Error('Auth not ready'); },
  login: async () => { throw new Error('Auth not ready'); },
  signup: async () => { throw new Error('Auth not ready'); },
  forgotPassword: async () => {},
  logout: async () => {},
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  authModalMode: 'login',
  setAuthModalMode: () => {},
  currentView: 'home',
  setCurrentView: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Sync or retrieve user profile in Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userRef);

          const isSuperAdmin = currentUser.email === 'mr.jeet325@gmail.com';
          const defaultRole = isSuperAdmin ? 'admin' : 'client';

          const profileData: UserProfileData = {
            uid: currentUser.uid,
            displayName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'Member User'),
            email: currentUser.email || '',
            photoURL: currentUser.photoURL || '',
            role: defaultRole,
            lastLogin: serverTimestamp(),
          };

          if (!snap.exists()) {
            await setDoc(userRef, {
              ...profileData,
              createdAt: serverTimestamp(),
            });
            setUserProfile({ ...profileData, createdAt: new Date().toISOString() });
          } else {
            const existingData = snap.data() as UserProfileData;
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            setUserProfile({
              ...existingData,
              uid: currentUser.uid,
              displayName: currentUser.displayName || existingData.displayName,
              email: currentUser.email || existingData.email,
              photoURL: currentUser.photoURL || existingData.photoURL,
              role: existingData.role || defaultRole,
            });
          }
        } catch (e) {
          console.warn('Could not sync user profile to firestore:', e);
        }
      } else {
        setUserProfile(null);
        // If logged out while in protected dashboard, automatically redirect to home
        setCurrentView('home');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogleProvider = async () => {
    const loggedUser = await signInWithGoogle();
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  const login = async (email: string, pass: string) => {
    const loggedUser = await loginWithEmail(email, pass);
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  const signup = async (email: string, pass: string, name?: string) => {
    const loggedUser = await signupWithEmail(email, pass, name);
    setIsAuthModalOpen(false);
    return loggedUser;
  };

  const forgotPassword = async (email: string) => {
    await resetPassword(email);
  };

  const logout = async () => {
    await logOut();
    setCurrentView('home');
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        loginWithGoogleProvider,
        login,
        signup,
        forgotPassword,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

