import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../shared/LoadingScreen';
import ErrorPage from '../shared/ErrorPage';
import type { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireVenue?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requireVenue = false
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <ErrorPage
        code="403"
        title="Access Denied"
        message="You don't have permission to access this page."
      />
    );
  }

  // Requires venue selection but no venue is selected
  if (requireVenue && !location.search.includes('id=')) {
    return <Navigate to="/venue" replace />;
  }

  return <>{children}</>;
}