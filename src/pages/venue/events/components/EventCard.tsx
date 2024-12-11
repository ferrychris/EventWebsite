import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import type { Event } from '../../../../types';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  // Create display name for the couple
  const coupleDisplayName = event.partner1_firstname && event.partner2_firstname
    ? `${event.partner1_firstname} & ${event.partner2_firstname}'s Wedding`
    : event.title;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-6 cursor-pointer 
        hover:shadow-lg hover:border-gray-200 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{coupleDisplayName}</h3>
        <span 
          className={`px-3 py-1 rounded-full text-sm ${
            isPast 
              ? 'bg-gray-100 text-gray-800' 
              : 'text-white'
          }`}
          style={{ 
            backgroundColor: isPast ? undefined : primaryColor
          }}
        >
          {isPast ? 'Past' : 'Upcoming'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{eventDate.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Users className="w-5 h-5 mr-2" />
          <span>0 / {event.guest_limit} guests confirmed</span>
        </div>
      </div>
    </div>
  );
}