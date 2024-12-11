import React from 'react';
import { useVenue } from '../../../hooks/useVenue';
import { useVenueEvents } from '../../../hooks/useVenueEvents';
import Card from '../../../components/common/Card';

export default function Overview() {
  const { venue, loading: venueLoading } = useVenue();
  const { events, loading: eventsLoading } = useVenueEvents();

  if (venueLoading || eventsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card title="Overview Stats">
        <div>Overview content will go here</div>
      </Card>
    </div>
  );
}