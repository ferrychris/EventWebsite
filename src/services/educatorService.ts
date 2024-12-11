// src/services/educatorService.ts
import { supabase } from '../config/supabase';
import type { Educator } from '../types/venue';

export async function fetchEducators() {
  try {
    const { data, error } = await supabase
      .from('educators')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching educators:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch educators',
    };
  }
}

export async function fetchEducator(id: string) {
  try {
    const { data, error } = await supabase
      .from('educators')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching educator:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch educator',
    };
  }
}

export async function fetchEducatorWithEvents(id: string) {
  try {
    const { data, error } = await supabase
      .from('educators')
      .select(
        `
        *,
        education_events (*)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching educator with events:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch educator',
    };
  }
}

export async function createEducator(
  educator: Omit<Educator, 'id' | 'created_at'>
) {
  try {
    const { data, error } = await supabase
      .from('educators')
      .insert(educator)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error creating educator:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create educator',
    };
  }
}

export async function updateEducator(id: string, updates: Partial<Educator>) {
  try {
    const { data, error } = await supabase
      .from('educators')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating educator:', err);
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update educator',
    };
  }
}

export async function deleteEducator(id: string) {
  try {
    const { error } = await supabase.from('educators').delete().eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('Error deleting educator:', err);
    return {
      error: err instanceof Error ? err.message : 'Failed to delete educator',
    };
  }
}
