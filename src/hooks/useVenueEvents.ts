import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchVenueEvents } from '../config/supabase';
import type { Database } from '../types/database.types';

type Event = Database['public']['Tables']['events']['Row'];

export function useVenueEvents() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      if (!venueId) return;

      try {
        setLoading(true);
        const data = await fetchVenueEvents(venueId);
        setEvents(data);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [venueId]);

  return { events, loading, error };
}