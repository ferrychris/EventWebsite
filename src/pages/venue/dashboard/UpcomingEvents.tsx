import React from 'react';
import { useVenueEvents } from '../../../hooks/useVenueEvents';
import Card from '../../../components/common/Card';

export default function UpcomingEvents() {
  const { events, loading } = useVenueEvents();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card title="Upcoming Events">
        <div>Events list will go here</div>
      </Card>
    </div>
  );
}