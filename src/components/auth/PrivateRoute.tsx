import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../shared/LoadingScreen';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireVenue?: boolean;
}

export default function PrivateRoute({ children, requireVenue = false }: PrivateRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if venue selection is required
  if (requireVenue && !location.search.includes('id=')) {
    return <Navigate to="/venue" replace />;
  }

  return <>{children}</>;
}