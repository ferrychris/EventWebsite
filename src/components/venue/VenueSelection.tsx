import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Venue } from '../../types';

interface VenueWithCounts extends Venue {
  events_count: number;
  policies_count: number;
}

export default function VenueSelection() {
  const [venues, setVenues] = useState<VenueWithCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchVenues() {
      try {
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('*, events(count)')
          .eq('id', user?.id);

        if (venuesError) throw venuesError;

        const venuesWithCounts = venuesData?.map(venue => ({
          ...venue,
          events_count: (venue.events as any)?.[0]?.count || 0,
          policies_count: Array.isArray(venue.policies) ? venue.policies.length : 0
        })) || [];

        setVenues(venuesWithCounts);

        // If there's exactly one venue, navigate directly to its dashboard
        if (venuesWithCounts.length === 1) {
          navigate(`/venue/dashboard?id=${venuesWithCounts[0].id}`);
          return;
        }
      } catch (err) {
        console.error('Error fetching venues:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch venues');
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [user?.id, navigate]);

  // If no venues found, show error and logout option
  if (venues.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Venues Found</h2>
          <p className="text-gray-600 mb-4">There was an error setting up your venue. Please try logging out and in again.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading venues...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Select a Venue</h1>
        
        <div className="grid gap-6">
          {venues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => navigate(`/venue/dashboard?id=${venue.id}`)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all flex items-center justify-between group animate-scale"
            >
              <div className="flex items-center">
                <div className="p-3 bg-gray-50 rounded-xl mr-6">
                  <Building2 className="w-8 h-8 text-gray-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-gray-900">{venue.name}</h2>
                  <p className="text-gray-600 mt-1">
                    {venue.policies_count} policies • {venue.events_count} events
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}