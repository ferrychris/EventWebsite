import React, { useState } from 'react';
import { Calendar, Users, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useVenueEvents } from '../../../hooks/useVenueEvents';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import CreateEventModal from './components/CreateEventModal';
import EventCard from './components/EventCard';
import type { RootState } from '../../../store';

export default function ClientManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { events, loading } = useVenueEvents();
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
              <Calendar className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Events</div>
              <div className="text-2xl font-semibold text-gray-900">{events.length}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
              <Users className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Guests</div>
              <div className="text-2xl font-semibold text-gray-900">0</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${primaryColor}10` }}>
              <Calendar className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
              <div className="text-2xl font-semibold text-gray-900">
                {events.filter(e => new Date(e.date) > new Date()).length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Events</h2>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            style={{ backgroundColor: primaryColor }}
          >
            Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
              onClick={() => {/* Handle event click */}}
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Events</h3>
            <p className="text-gray-600 mt-2">Create your first event to get started</p>
          </div>
        )}
      </Card>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}