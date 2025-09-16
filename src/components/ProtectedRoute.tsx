import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Lock, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  fallback 
}) => {
  const { user, isAdmin, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex-1 bg-gradient-to-b from-gray-800 to-black text-white overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return fallback || (
      <div className="flex-1 bg-gradient-to-b from-blue-800 to-black text-white overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
            <p className="text-gray-300 mb-6">Please sign in to access this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check admin privileges if required
  if (requireAdmin && !isAdmin) {
    return fallback || (
      <div className="flex-1 bg-gradient-to-b from-red-800 to-black text-white overflow-y-auto">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
            <p className="text-gray-300 mb-2">You need administrator privileges to access this page.</p>
            <p className="text-gray-400 text-sm mb-6">
              Current user: {user.email} ({isAdmin ? 'Admin' : 'Regular User'})
            </p>
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm">
                To get admin access, sign in with an email containing "admin"
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;