// ============================================================
// App Component — Main Router
// ============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vote from './pages/Vote';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Layout with Navbar for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="relative z-10">{children}</main>
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen relative">
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Dashboard />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/vote/:pollId"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Vote />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/results/:pollId"
              element={
                <ProtectedRoute>
                  <AuthenticatedLayout>
                    <Results />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AuthenticatedLayout>
                    <AdminDashboard />
                  </AuthenticatedLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
