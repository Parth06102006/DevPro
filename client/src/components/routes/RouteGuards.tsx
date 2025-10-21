import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#040212]">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500">
      <div className="sr-only">Loading...</div>
    </div>
  </div>
);

// Protected Route - Only authenticated users can access
export const ProtectedRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, checkAuthStatus } = useAuth();
  const location = useLocation();

  // Re-check auth status when component mounts
  useEffect(() => {
    if (!user && !isLoading) {
      checkAuthStatus();
    }
  }, [user, isLoading, checkAuthStatus]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public Route - Only unauthenticated users can access (login, signup pages)
export const PublicRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, checkAuthStatus } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Re-check auth status when component mounts
  useEffect(() => {
    if (!user && !isLoading) {
      checkAuthStatus();
    }
  }, [user, isLoading, checkAuthStatus]);

  // Handle redirect when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Get the intended destination from location state, or default to dashboard
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, location.state, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // This will be handled by the useEffect above, but include as fallback
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

// Public Access Route - Can be accessed by both authenticated and unauthenticated users (landing page)
export const PublicAccessRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { isLoading, user, checkAuthStatus } = useAuth();

  // Re-check auth status when component mounts
  useEffect(() => {
    if (!user && !isLoading) {
      checkAuthStatus();
    }
  }, [user, isLoading, checkAuthStatus]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};
