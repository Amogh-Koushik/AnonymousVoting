// ============================================================
// Login Page
// Google OAuth sign-in with premium glassmorphism design
// ============================================================

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { HiShieldCheck, HiLockClosed, HiUserGroup } from 'react-icons/hi';
import Loader from '../components/Loader';

const Login = () => {
  const { signInWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      setError(null);
      await signInWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-4">
            <span className="text-white font-bold text-2xl">AV</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Anon<span className="text-primary-400">Vote</span>
          </h1>
          <p className="text-dark-400 text-sm">
            Secure & anonymous polling platform
          </p>
        </div>

        {/* Login card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-dark-400 text-sm text-center mb-8">
            Sign in with your Google account to continue
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center animate-scale-in">
              {error}
            </div>
          )}

          {/* Google sign-in button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3.5 px-6 rounded-xl shadow-lg
                       transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {signingIn ? (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-primary-500 animate-spin" />
            ) : (
              <FcGoogle className="w-5 h-5" />
            )}
            {signingIn ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>

        {/* Feature badges */}
        <div className="mt-8 grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="glass-card p-3 text-center">
            <HiShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-[11px] text-dark-400 font-medium">Secure</p>
          </div>
          <div className="glass-card p-3 text-center">
            <HiLockClosed className="w-5 h-5 text-primary-400 mx-auto mb-1" />
            <p className="text-[11px] text-dark-400 font-medium">Anonymous</p>
          </div>
          <div className="glass-card p-3 text-center">
            <HiUserGroup className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-[11px] text-dark-400 font-medium">Transparent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
