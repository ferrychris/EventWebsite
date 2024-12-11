import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthForm from './components/auth/AuthForm';
import HomePage from './components/marketing/HomePage';
import DashboardLayout from './components/shared/Layout/DashboardLayout';
import VenueSelection from './components/venue/VenueSelection';

// Import all your existing page components here

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthForm mode="signin" />} />
      <Route path="/register" element={<AuthForm mode="signup" />} />

      {/* Protected Venue Routes */}
      <Route path="/venue" element={
        <ProtectedRoute requiredRole="venue">
          <VenueSelection />
        </ProtectedRoute>
      } />
      
      {/* Protected Dashboard Routes */}
      <Route path="/venue/*" element={
        <ProtectedRoute requiredRole="venue">
          <DashboardLayout />
        </ProtectedRoute>
      } />

      {/* Add more routes as needed */}
    </Routes>
  );
}