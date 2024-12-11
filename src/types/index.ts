import type { Database } from './database.types';

type Tables = Database['public']['Tables'];

// Core Types
export interface User {
  id: string;
  email: string;
  role: 'venue' | 'couple' | 'guest';
  name: string;
}

export type Venue = Tables['venues']['Row'];
export type Event = Tables['events']['Row'];
export type Guest = Tables['guests']['Row'];

// Store Types
export interface RootState {
  auth: AuthState;
  events: EventState;
  guests: GuestState;
  theme: ThemeState;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface EventState {
  currentEvent: Event | null;
  events: Event[];
  loading: boolean;
  error: string | null;
}

export interface GuestState {
  guests: Guest[];
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  primaryColor: string;
  font: 'cormorant' | 'playfair' | 'lora';
}