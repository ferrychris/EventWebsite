import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../../../config/supabase';
import type { RootState } from '../../../../store';
import Button from '../../../../components/common/Button';

interface CreateEventModalProps {
  onClose: () => void;
}

export default function CreateEventModal({ onClose }: CreateEventModalProps) {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  const [formData, setFormData] = useState({
    partner1_firstname: '',
    partner1_lastname: '',
    partner2_firstname: '',
    partner2_lastname: '',
    date: '',
    email: '',
    guest_limit: 150,
    description: 'Join us for our special day' // Add default description
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const validateDate = (date: string): boolean => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueId) return;

    if (!validateDate(formData.date)) {
      setError('Please select a future date');
      return;
    }

    setSaving(true);
    try {
      const title = `${formData.partner1_firstname} & ${formData.partner2_firstname}'s Wedding`;
      const couple_id = crypto.randomUUID();
      
      const { error: createError } = await supabase
        .from('events')
        .insert({
          title,
          date: formData.date,
          email: formData.email,
          venue_id: venueId,
          couple_id,
          guest_limit: formData.guest_limit,
          description: formData.description, // Add description field
          partner1_firstname: formData.partner1_firstname,
          partner1_lastname: formData.partner1_lastname,
          partner2_firstname: formData.partner2_firstname,
          partner2_lastname: formData.partner2_lastname
        });

      if (createError) throw createError;
      onClose();
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setSaving(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Create New Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Partner 1 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Partner 1</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.partner1_firstname}
                  onChange={(e) => setFormData({ ...formData, partner1_firstname: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
                  style={{ 
                    '--tw-ring-color': primaryColor,
                    '--tw-ring-opacity': 0.2
                  } as React.CSSProperties}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.partner1_lastname}
                  onChange={(e) => setFormData({ ...formData, partner1_lastname: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
                  style={{ 
                    '--tw-ring-color': primaryColor,
                    '--tw-ring-opacity': 0.2
                  } as React.CSSProperties}
                  required
                />
              </div>
            </div>
          </div>

          {/* Partner 2 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Partner 2</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.partner2_firstname}
                  onChange={(e) => setFormData({ ...formData, partner2_firstname: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
                  style={{ 
                    '--tw-ring-color': primaryColor,
                    '--tw-ring-opacity': 0.2
                  } as React.CSSProperties}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.partner2_lastname}
                  onChange={(e) => setFormData({ ...formData, partner2_lastname: e.target.value })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
                  style={{ 
                    '--tw-ring-color': primaryColor,
                    '--tw-ring-opacity': 0.2
                  } as React.CSSProperties}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Couple's Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={minDate}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Guest Limit
            </label>
            <input
              type="number"
              value={formData.guest_limit}
              onChange={(e) => setFormData({ ...formData, guest_limit: parseInt(e.target.value) })}
              min={1}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: primaryColor }}
            >
              {saving ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}