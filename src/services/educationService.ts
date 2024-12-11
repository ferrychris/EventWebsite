// src/services/educationService.ts
import { supabase } from '../config/supabase';
import type { EducationEvent } from '../types/venue';

// src/services/educationService.ts
export async function fetchEducationEvents() {
  try {
    const { data, error } = await supabase
      .from('education_events')
      .select(
        `
        *,
        educator:educators (
          id,
          name,
          title,
          profile_image
        )
      `
      )
      .order('start_time', { ascending: true })
      .eq('status', 'upcoming');

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching education events:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch events',
    };
  }
}

export async function registerForEvent(eventId: string, venueId: string) {
  try {
    const { data, error } = await supabase
      .from('education_event_registrations')
      .insert({
        event_id: eventId,
        venue_id: venueId,
        status: 'registered',
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error registering for event:', err);
    return {
      data: null,
      error:
        err instanceof Error ? err.message : 'Failed to register for event',
    };
  }
}
