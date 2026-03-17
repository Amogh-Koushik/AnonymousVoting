// ============================================================
// Auth Context
// Manages Firebase authentication state and user role
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Firebase user
  const [dbUser, setDbUser] = useState(null);    // Database user (email, role)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      // Login will be handled by onAuthStateChanged
      return result.user;
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDbUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
      setError(err.message);
    }
  };

  // Sync user login with backend
  const syncWithBackend = async (firebaseUser) => {
    try {
      const response = await api.post('/auth/login');
      if (response.data.success) {
        setDbUser(response.data.user);
      }
    } catch (err) {
      console.error('Backend sync error:', err);
      setError('Failed to sync with server.');
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        await syncWithBackend(firebaseUser);
      } else {
        setUser(null);
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    dbUser,
    loading,
    error,
    signInWithGoogle,
    logout,
    isAdmin: dbUser?.role === 'admin',
    isAuthenticated: !!user && !!dbUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
