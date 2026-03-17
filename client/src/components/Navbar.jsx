// ============================================================
// Navbar Component
// Top navigation bar with user info, admin badge, and logout
// ============================================================

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiLogout, HiHome, HiShieldCheck, HiMenuAlt3, HiX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, dbUser, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <HiHome className="w-4 h-4" /> },
  ];

  if (isAdmin) {
    navLinks.push({
      path: '/admin',
      label: 'Admin Panel',
      icon: <HiShieldCheck className="w-4 h-4" />,
    });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              <span className="text-white font-bold text-sm">AV</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              Anon<span className="text-primary-400">Vote</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.path)
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* User info + logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-primary-500/30"
                />
              )}
              <div className="text-right">
                <p className="text-sm text-white font-medium truncate max-w-[150px]">
                  {user?.displayName || dbUser?.email}
                </p>
                {isAdmin && (
                  <span className="text-[10px] font-bold uppercase text-primary-400 tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
              title="Sign out"
            >
              <HiLogout className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-dark-300 hover:text-white p-2"
          >
            {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-dark-900/95 backdrop-blur-xl animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 mb-3">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border-2 border-primary-500/30"
                />
              )}
              <div>
                <p className="text-sm text-white font-medium">
                  {user?.displayName || dbUser?.email}
                </p>
                <p className="text-xs text-dark-400">{dbUser?.email}</p>
              </div>
              {isAdmin && (
                <span className="badge-active ml-auto text-[10px]">Admin</span>
              )}
            </div>

            {/* Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all
                  ${isActive(link.path)
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-dark-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              <HiLogout className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
