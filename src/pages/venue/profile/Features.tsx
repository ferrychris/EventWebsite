import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Check } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import type { RootState } from '../../../store';
import { Card, Input, SaveButton } from '../../../components/common';
import type { VenueAmenity } from '../../../types/venue';

const venueTypes = [
  'Aquarium/Zoo', 'Ballroom', 'Banquet Hall', 'Barn', 'Beach/Waterfront',
  'Boat/Cruise', 'Castle', 'Country Club', 'Desert Setting', 'Estate',
  'Garden', 'Historic Venue', 'Hotel', 'Industrial & Warehouse', 'Library',
  'Loft', 'Mountain Setting', 'Museum', 'Park', 'Religious Setting',
  'Restaurant', 'Rooftop', 'Tree-covered Setting', 'Vineyard & Winery'
];

const defaultAmenities: VenueAmenity[] = [
  // Ceremony Spaces
  { id: 'indoor-ceremony', name: 'Indoor Ceremony Space', category: 'ceremony', included: false },
  { id: 'outdoor-ceremony', name: 'Outdoor Ceremony Space', category: 'ceremony', included: false },
  { id: 'covered-ceremony', name: 'Covered Outdoor Ceremony Space', category: 'ceremony', included: false },
  { id: 'multiple-ceremony', name: 'Multiple Ceremony Locations', category: 'ceremony', included: false },

  // Reception Spaces
  { id: 'indoor-reception', name: 'Indoor Reception Space', category: 'reception', included: false },
  { id: 'outdoor-reception', name: 'Outdoor Reception Space', category: 'reception', included: false },
  { id: 'covered-reception', name: 'Covered Outdoor Reception Space', category: 'reception', included: false },
  { id: 'multiple-reception', name: 'Multiple Reception Spaces', category: 'reception', included: false },

  // Getting Ready Spaces
  { id: 'bridal-suite', name: 'Bridal Suite', category: 'prep', included: false },
  { id: "grooms-suite", name: "Groom's Suite", category: 'prep', included: false },
  { id: 'private-bathrooms', name: 'Private Bathrooms', category: 'prep', included: false },
  { id: 'makeup-stations', name: 'Hair & Makeup Stations', category: 'prep', included: false },

  // Kitchen & Catering
  { id: 'full-kitchen', name: 'Full Kitchen', category: 'catering', included: false },
  { id: 'prep-kitchen', name: 'Prep Kitchen', category: 'catering', included: false },
  { id: 'warming-kitchen', name: 'Warming Kitchen', category: 'catering', included: false },
  { id: 'refrigeration', name: 'Refrigeration', category: 'catering', included: false },
  { id: 'ice-machine', name: 'Ice Machine', category: 'catering', included: false },
  { id: 'catering-services', name: 'Catering Services', category: 'catering', included: false },
  { id: 'bar-services', name: 'Bar Services', category: 'catering', included: false },

  // Furniture & Equipment
  { id: 'tables', name: 'Tables', category: 'furniture', included: false },
  { id: 'chairs', name: 'Chairs', category: 'furniture', included: false },
  { id: 'linens', name: 'Linens', category: 'furniture', included: false },
  { id: 'dance-floor', name: 'Dance Floor', category: 'furniture', included: false },
  { id: 'audio-system', name: 'Audio System', category: 'furniture', included: false },
  { id: 'event-lighting', name: 'Event Lighting', category: 'furniture', included: false },
  { id: 'event-rentals', name: 'Event Rentals', category: 'furniture', included: false },

  // Services
  { id: 'event-coordinator', name: 'Event Coordinator', category: 'services', included: false },
  { id: 'event-staff', name: 'Event Staff', category: 'services', included: false },
  { id: 'security-staff', name: 'Security Staff', category: 'services', included: false },
  { id: 'cleanup-service', name: 'Cleanup Service', category: 'services', included: false },
  { id: 'setup-service', name: 'Setup Service', category: 'services', included: false },
  { id: 'transportation', name: 'Transportation', category: 'services', included: false },
  { id: 'valet-parking', name: 'Valet Parking', category: 'services', included: false },
  { id: 'wedding-cake', name: 'Wedding Cake Services', category: 'services', included: false },

  // Additional Features
  { id: 'wifi', name: 'WiFi', category: 'additional', included: false },
  { id: 'handicap-accessible', name: 'Handicap Accessible', category: 'additional', included: false },
  { id: 'pet-friendly', name: 'Pet Friendly', category: 'additional', included: false },
  { id: 'liability-insurance', name: 'Liability Insurance', category: 'additional', included: false },
  { id: 'outside-vendors', name: 'Outside Vendors Allowed', category: 'additional', included: false },
  { id: 'onsite-accommodations', name: 'On-Site Accommodations', category: 'additional', included: false },
  { id: 'onsite-parking', name: 'Onsite Parking', category: 'additional', included: false }
];

export default function Features() {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [amenities, setAmenities] = useState(defaultAmenities);
  const [customAmenity, setCustomAmenity] = useState('');
  const [saving, setSaving] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [indoorSpace, setIndoorSpace] = useState(0);
  const [outdoorSpace, setOutdoorSpace] = useState(0);


  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleAmenityToggle = (id: string) => {
    setAmenities(amenities.map(amenity => 
      amenity.id === id ? { ...amenity, included: !amenity.included } : amenity
    ));
  };

  const addCustomAmenity = () => {
    if (!customAmenity.trim()) return;

    const newAmenity: VenueAmenity = {
      id: `custom-${Date.now()}`,
      name: customAmenity.trim(),
      category: 'custom',
      included: true
    };

    setAmenities([...amenities, newAmenity]);
    setCustomAmenity('');
  };

  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');

  const [error, setError] = useState<string | null>(null);

  
  const removeAmenity = (id: string) => {
    setAmenities(amenities.filter(amenity => amenity.id !== id));
  };

  const handleSave = async () => {
  if (!venueId) return;
  
  setSaving(true);
  try {
    // Convert amenities to features object structure
    const features = {
      ceremony_spaces: {},
      reception_spaces: {},
      getting_ready: {},
      kitchen_catering: {},
      furniture_equipment: {},
      services: {},
      additional: {},
      custom_features: [] as string[]
    };

    // Map amenities to their categories
    amenities.forEach(amenity => {
      if (amenity.category === 'custom' && amenity.included) {
        features.custom_features.push(amenity.name);
      } else {
        const categoryMap = {
          'ceremony': 'ceremony_spaces',
          'reception': 'reception_spaces',
          'prep': 'getting_ready',
          'catering': 'kitchen_catering',
          'furniture': 'furniture_equipment',
          'services': 'services',
          'additional': 'additional'
        } as const;

        const category = categoryMap[amenity.category];
        if (category) {
          features[category][amenity.id] = amenity.included;
        }
      }
    });

    // Update venue in Supabase
    const { error: updateError } = await supabase
      .from('venues')
      .update({
        max_capacity: maxCapacity,
        indoor_space: indoorSpace,
        outdoor_space: outdoorSpace,
        venue_types: selectedTypes,
        features
      })
      .eq('id', venueId);

    if (updateError) throw updateError;
  } catch (err) {
    console.error('Error saving venue features:', err);
    setError(err instanceof Error ? err.message : 'Failed to save venue features');
  } finally {
    setSaving(false);
  }
};


  const renderAmenityButtons = (category: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {amenities
        .filter(amenity => amenity.category === category)
        .map(amenity => (
          <button
            key={amenity.id}
            type="button"
            onClick={() => handleAmenityToggle(amenity.id)}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              amenity.included
                ? 'border-transparent text-white'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
            style={{ 
              backgroundColor: amenity.included ? primaryColor : undefined,
              opacity: amenity.included ? 1 : 0.8
            }}
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              amenity.included ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              <Check className={`w-3 h-3 ${
                amenity.included ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <span className="flex-1 text-left">{amenity.name}</span>
          </button>
        ))
      }
    </div>
  );

useEffect(() => {
  async function fetchVenue() {
    if (!venueId) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();

      if (fetchError) throw fetchError;
      if (data) {
        // Set capacity values
        setMaxCapacity(data.max_capacity || 0);
        setIndoorSpace(data.indoor_space || 0);
        setOutdoorSpace(data.outdoor_space || 0);

        // Set venue types
        setSelectedTypes(data.venue_types || []);

        // Set amenities based on features data
        if (data.features) {
          const newAmenities = [...amenities];
          
          // Update standard amenities
          Object.entries(data.features).forEach(([category, features]) => {
            if (category === 'custom_features') return;
            
            Object.entries(features as Record<string, boolean>).forEach(([id, included]) => {
              const amenityIndex = newAmenities.findIndex(a => a.id === id);
              if (amenityIndex !== -1) {
                newAmenities[amenityIndex].included = included;
              }
            });
          });

          // Add custom features
          const customFeatures = data.features.custom_features || [];
          customFeatures.forEach((feature: string) => {
            newAmenities.push({
              id: `custom-${Date.now()}-${Math.random()}`,
              name: feature,
              category: 'custom',
              included: true
            });
          });

          setAmenities(newAmenities);
        }
      }
    } catch (err) {
      console.error('Error fetching venue:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch venue');
    }
  }

  fetchVenue();
}, [venueId]);

  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
      {/* Capacity */}
      <Card title="Venue Capacity">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
  label="Maximum Capacity"
  type="number"
  value={maxCapacity}
  onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)}
  placeholder="Enter max guests"
/>
<Input
  label="Indoor Space (sq ft)"
  type="number"
  value={indoorSpace}
  onChange={(e) => setIndoorSpace(parseInt(e.target.value) || 0)}
  placeholder="Enter indoor space"
/>
<Input
  label="Outdoor Space (sq ft)"
  type="number"
  value={outdoorSpace}
  onChange={(e) => setOutdoorSpace(parseInt(e.target.value) || 0)}
  placeholder="Enter outdoor space"
/>
        </div>
      </Card>

      {/* Venue Type */}
      <Card title="Venue Type">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venueTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeToggle(type)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedTypes.includes(type)
                  ? 'border-transparent text-white'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
              style={{ 
                backgroundColor: selectedTypes.includes(type) ? primaryColor : undefined,
                opacity: selectedTypes.includes(type) ? 1 : 0.8
              }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                selectedTypes.includes(type) ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                <Check className={`w-3 h-3 ${
                  selectedTypes.includes(type) ? 'text-white' : 'text-gray-400'
                }`} />
              </div>
              <span className="flex-1 text-left">{type}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Ceremony Spaces */}
      <Card title="Ceremony Spaces">
        {renderAmenityButtons('ceremony')}
      </Card>

      {/* Reception Spaces */}
      <Card title="Reception Spaces">
        {renderAmenityButtons('reception')}
      </Card>

      {/* Getting Ready Spaces */}
      <Card title="Getting Ready Spaces">
        {renderAmenityButtons('prep')}
      </Card>

      {/* Kitchen & Catering */}
      <Card title="Kitchen & Catering">
        {renderAmenityButtons('catering')}
      </Card>

      {/* Furniture & Equipment */}
      <Card title="Furniture & Equipment">
        {renderAmenityButtons('furniture')}
      </Card>

      {/* Services */}
      <Card title="Services">
        {renderAmenityButtons('services')}
      </Card>

      {/* Additional Features */}
      <Card title="Additional Features">
        <div className="space-y-6">
          {renderAmenityButtons('additional')}

          <div className="flex gap-3">
            <Input
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add custom feature..."
              className="flex-1"
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
              disabled={!customAmenity.trim()}
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </Card>

      <SaveButton saving={saving} />
    </form>
  );
}