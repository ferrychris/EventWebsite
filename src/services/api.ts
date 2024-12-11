// import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import { supabase } from '../config/supabase';
type Tables = Database['public']['Tables'];

export const api = {
  // Events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*');
    if (error) throw error;
    return data;
  },

  async getEvent(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async createEvent(event: Tables['events']['Insert']) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Guests
  async getGuests(eventId: string) {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId);
    if (error) throw error;
    return data;
  },

  async updateGuestStatus(guestId: string, status: Tables['guests']['Row']['status']) {
    const { data, error } = await supabase
      .from('guests')
      .update({ status })
      .eq('id', guestId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addGuests(guests: Tables['guests']['Insert'][]) {
    const { data, error } = await supabase
      .from('guests')
      .insert(guests)
      .select();
    if (error) throw error;
    return data;
  },

  // Venues
  async getVenue(id: string) {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateVenue(id: string, venue: Partial<Tables['venues']['Update']>) {
    const { data, error } = await supabase
      .from('venues')
      .update(venue)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};