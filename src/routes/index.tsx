import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/auth/PrivateRoute';
import AuthForm from '../components/auth/AuthForm';
import ErrorPage from '../components/shared/ErrorPage';
import HomePage from '../components/marketing/HomePage';
import VenueSelection from '../components/venue/VenueSelection';
import DashboardLayout from '../components/shared/Layout/DashboardLayout';
import ErrorBoundary from '../components/shared/ErrorBoundary';

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthForm mode="signin" />} />
        <Route path="/register" element={<AuthForm mode="signup" />} />

        {/* Venue Selection */}
        <Route path="/venue" element={
          <PrivateRoute>
            <VenueSelection />
          </PrivateRoute>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/venue/*" element={
          <PrivateRoute requireVenue>
            <DashboardLayout />
          </PrivateRoute>
        } />

        {/* 404 Page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ErrorBoundary>
  );
}