import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSession } from '../hooks/useAuthSession';
import type { AuthContextType } from '../types/auth';
import LoadingScreen from '../components/shared/LoadingScreen';
import { supabase } from '../config/supabase';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user, loading, error } = useAuthSession();

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      role: 'venue' | 'couple',
      metadata?: Record<string, any>
    ) => {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            ...metadata,
          },
        },
      });

      if (authError) throw authError;

      if (role === 'venue' && data.user) {
        const { error: venueError } = await supabase.from('venues').insert({
          id: data.user.id,
          name: metadata?.venueName || '',
          email: email,
          created_at: new Date().toISOString(),
          branding: {
            colors: {
              primary: '#1e40af',
              secondary: '#f472b6',
            },
          },
          policies: [],
          features: {},
        });

        if (venueError) throw venueError;
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  }, [navigate]);

  if (loading) {
    return <LoadingScreen onTimeout={signOut} timeout={5000} />;
  }

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshAuth: signOut, // Added as a fallback if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
