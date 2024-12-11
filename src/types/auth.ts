import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from './database.types';

export type UserRole = 'venue' | 'couple';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  metadata?: Record<string, any>;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    metadata?: Record<string, any>
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// In src/types/auth.ts
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  metadata?: Record<string, any>;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface AuthSessionHook extends AuthState {
  refreshUser: () => Promise<void>;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    metadata?: Record<string, any>
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}
