import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types/auth';
import { supabase } from '../config/supabase';
export function useAuthSession() {
  const [state, setState] = useState<{
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
  }>({
    user: null,
    loading: true,
    error: null,
  });

  const fetchUserProfile = useCallback(
    async (userId: string, userEmail: string) => {
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .select('*')
        .eq('id', userId)
        .single();

      if (venueError) throw venueError;

      return {
        id: userId,
        email: userEmail,
        role: 'venue' as const,
        name: venue?.name,
        metadata: venue,
      };
    },
    []
  );

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        setState({ user: null, loading: false, error: error.message });
        return;
      }

      if (!session) {
        setState({ user: null, loading: false, error: null });
        return;
      }

      try {
        const userProfile = await fetchUserProfile(
          session.user.id,
          session.user.email!
        );
        setState({ user: userProfile, loading: false, error: null });
      } catch (err) {
        setState({
          user: null,
          loading: false,
          error:
            err instanceof Error ? err.message : 'Failed to fetch user profile',
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_OUT') {
        setState({ user: null, loading: false, error: null });
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        try {
          const userProfile = await fetchUserProfile(
            session.user.id,
            session.user.email!
          );
          setState({ user: userProfile, loading: false, error: null });
        } catch (err) {
          setState({
            user: null,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : 'Failed to fetch user profile',
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  return state;
}
