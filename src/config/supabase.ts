import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

// Fetching environment variables for Supabase URL and Key (ensure .env is set correctly)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;  // Ensure this is in .env
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;  // Ensure this is in .env

// Create a Supabase client instance
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  db: {
    schema: "public",
  },
});

// Auth functions
export async function signInWithEmail(email: string, password: string) {
  try {
    return await supabase.auth.signInWithPassword({ email, password });
  } catch (error) {
    console.error("SignIn error:", error);
    throw error;
  }
}

export async function signUpVenue(email: string, password: string, venueName: string) {
  try {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: "venue", venueName } },
    });

    if (authError) throw authError;

    if (data.user) {
      const { error: venueError } = await supabase.from("venues").insert({
        id: data.user.id,
        name: venueName,
        email: email,
        created_at: new Date().toISOString(),
        branding: { colors: { primary: "#1e40af", secondary: "#f472b6" } },
        policies: [],
        features: {},
      });

      if (venueError) throw venueError;
    }

    return { data, error: null };
  } catch (error) {
    console.error("SignUp Venue error:", error);
    return { error };
  }
}

export async function signOut() {
  try {
    window.localStorage.clear();
    return await supabase.auth.signOut();
  } catch (error) {
    console.error("SignOut error:", error);
    throw error;
  }
}

export async function getCurrentSession() {
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("Get session error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return { user: null, error };

    const { data: venue } = await supabase.from("venues").select("*").eq("id", user.id).single();

    return { user: { ...user, profile: venue }, error: null };
  } catch (error) {
    console.error("Get Current User error:", error);
    return { user: null, error };
  }
}

// Helper functions with improved error handling
export async function fetchVenue(venueId: string) {
  try {
    const { data, error } = await supabase.from("venues").select("*").eq("id", venueId).single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching venue:", error);
    throw error;
  }
}

export async function fetchVenueEvents(venueId: string) {
  try {
    const { data, error } = await supabase.from("events").select("*").eq("venue_id", venueId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function fetchTemplates(venueId: string) {
  try {
    const { data, error } = await supabase.from("email_templates").select("*").eq("venue_id", venueId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching templates:", error);
    return { data: null, error: error instanceof Error ? error.message : "Failed to fetch templates" };
  }
}

// export async function createTemplate(template: Partial<Database["public"]["Tables"]["email_templates"]["Insert"]>) {
//   try {
//     const { data, error } = await supabase.from("email_templates").insert(template).select().single();
//     if (error) throw error;
//     return { data, error: null };
//   } catch (error) {
//     console.error("Error creating template:", error);
//     return { data: null, error: error instanceof Error ? error.message : "Failed to create template" };
//   }
// }

// export async function updateTemplate(templateId: string, updates: Partial<Database["public"]["Tables"]["email_templates"]["Update"]>) {
//   try {
//     const { data, error } = await supabase.from("email_templates").update(updates).eq("id", templateId).select().single();
//     if (error) throw error;
//     return { data, error: null };
//   } catch (error) {
//     console.error("Error updating template:", error);
//     return { data: null, error: error instanceof Error ? error.message : "Failed to update template" };
//   }
// }

export async function deleteTemplate(templateId: string) {
  try {
    const { error } = await supabase.from("email_templates").delete().eq("id", templateId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting template:", error);
    return { error: error instanceof Error ? error.message : "Failed to delete template" };
  }
}
