import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchVenue } from '../config/supabase';
import type { Database } from '../types/database.types';

type Venue = Database['public']['Tables']['venues']['Row'];

export function useVenue() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVenue() {
      if (!venueId) return;

      try {
        setLoading(true);
        const data = await fetchVenue(venueId);
        setVenue(data);
      } catch (err) {
        console.error('Error loading venue:', err);
        setError(err instanceof Error ? err.message : 'Failed to load venue');
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [venueId]);

  return { venue, loading, error };
}