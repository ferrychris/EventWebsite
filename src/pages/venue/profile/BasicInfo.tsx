import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { supabase } from '../../../config/supabase';
import type { RootState } from '../../../store';
import { Card, Input, TextArea, SaveButton } from '../../../components/common';
import AddressForm from './components/AddressForm';
import ContactForm from './components/ContactForm';
import LocationMap from './components/LocationMap';
import type { VenueAddress, VenueContactInfo } from '../../../types/venue';

export default function BasicInfo() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    description: '',
    address: null as VenueAddress | null,
    contact_info: {
      primary_contact: '',
      phone: '',
      alternate_email: ''
    },
    social_media: {
      instagram: '',
      facebook: '',
      pinterest: '',
      tiktok: ''
    }
  });

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
          setFormData({
            name: data.name || '',
            email: data.email || '',
            website: data.website || '',
            description: data.description || '',
            address: data.address,
            contact_info: data.contact_info || {
              primary_contact: '',
              phone: '',
              alternate_email: ''
            },
            social_media: data.social_media || {
              instagram: '',
              facebook: '',
              pinterest: '',
              tiktok: ''
            }
          });
        }
      } catch (err) {
        console.error('Error fetching venue:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch venue');
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [venueId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueId) return;

    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('venues')
        .update({
          name: formData.name,
          email: formData.email,
          website: formData.website,
          description: formData.description,
          address: formData.address,
          contact_info: formData.contact_info,
          social_media: formData.social_media
        })
        .eq('id', venueId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating venue:', err);
      setError(err instanceof Error ? err.message : 'Failed to update venue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <Card title="Basic Information">
        <div className="space-y-4">
          <Input
            label="Venue Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter venue name"
            required
          />

          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your venue"
            rows={4}
          />

          <Input
            label="Website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
      </Card>

      <Card title="Location">
        <div className="space-y-6">
          <AddressForm
            address={formData.address}
            onAddressChange={(address) => setFormData({ ...formData, address })}
            primaryColor={primaryColor}
          />
          
          {formData.address && (
            <LocationMap address={formData.address} />
          )}
        </div>
      </Card>

      <Card title="Contact Information">
        <ContactForm
          contactInfo={formData.contact_info}
          onContactInfoChange={(contact_info) => setFormData({ ...formData, contact_info })}
          primaryColor={primaryColor}
        />
      </Card>

      <Card title="Social Media">
        <div className="space-y-4">
          <Input
            label="Instagram"
            value={formData.social_media.instagram}
            onChange={(e) => setFormData({
              ...formData,
              social_media: { ...formData.social_media, instagram: e.target.value }
            })}
            placeholder="@username"
          />

          <Input
            label="Facebook"
            value={formData.social_media.facebook}
            onChange={(e) => setFormData({
              ...formData,
              social_media: { ...formData.social_media, facebook: e.target.value }
            })}
            placeholder="facebook.com/page"
          />

          <Input
            label="Pinterest"
            value={formData.social_media.pinterest}
            onChange={(e) => setFormData({
              ...formData,
              social_media: { ...formData.social_media, pinterest: e.target.value }
            })}
            placeholder="pinterest.com/user"
          />

          <Input
            label="TikTok"
            value={formData.social_media.tiktok}
            onChange={(e) => setFormData({
              ...formData,
              social_media: { ...formData.social_media, tiktok: e.target.value }
            })}
            placeholder="@username"
          />
        </div>
      </Card>

      <SaveButton saving={saving} />
    </form>
  );
}