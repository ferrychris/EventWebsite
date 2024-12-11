import React from 'react';
import { useVenue } from '../../../hooks/useVenue';
import Card from '../../../components/common/Card';

export default function Photos() {
  const { venue, loading } = useVenue();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card title="Photo Gallery">
        <div>Photo gallery content will go here</div>
      </Card>
    </div>
  );
}