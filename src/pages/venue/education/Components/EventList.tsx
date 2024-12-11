import { useSelector } from 'react-redux';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  DollarSign,
  Lock,
  ExternalLink,
} from 'lucide-react';
import type { RootState } from '../../../../store';
import Button from '../../../../components/common/Button';
import Badge from '../../../../components/common/Badge';
import EventActions from './EventActions';
import type {
  EventListProps,
  EducationEventType,
  EducationCategory,
} from '../../../../types/venue';

export default function EventList({
  events,
  selectedTimezone,
  onEventClick,
}: EventListProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  const formatEventTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: selectedTimezone,
        timeZoneName: 'short',
      }).format(new Date(dateString));
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Time not available';
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: selectedTimezone,
      }).format(new Date(dateString));
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const getEventTypeStyle = (
    type: EducationEventType
  ): { color: string; bgColor: string } => {
    const styles = {
      webinar: { color: 'text-blue-800', bgColor: 'bg-blue-100' },
      workshop: { color: 'text-purple-800', bgColor: 'bg-purple-100' },
      vacation: { color: 'text-green-800', bgColor: 'bg-green-100' },
      thirdParty: { color: 'text-orange-800', bgColor: 'bg-orange-100' },
    };
    return styles[type] || { color: 'text-gray-800', bgColor: 'bg-gray-100' };
  };

  const getCategoryStyle = (
    category: EducationCategory
  ): { color: string; bgColor: string } => {
    const styles = {
      marketing: { color: 'text-pink-800', bgColor: 'bg-pink-100' },
      operations: { color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
      sales: { color: 'text-cyan-800', bgColor: 'bg-cyan-100' },
      technology: { color: 'text-indigo-800', bgColor: 'bg-indigo-100' },
      finance: { color: 'text-emerald-800', bgColor: 'bg-emerald-100' },
    };
    return (
      styles[category] || { color: 'text-gray-800', bgColor: 'bg-gray-100' }
    );
  };

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date/Time Column */}
            <div className="sm:w-48 flex-shrink-0">
              <div className="text-lg font-semibold">
                {formatEventDate(event.start_time)}
              </div>
              <div className="flex items-center text-gray-600 gap-1 mt-1">
                <Clock className="w-4 h-4" />
                {formatEventTime(event.start_time)}
              </div>
              {event.location && (
                <div className="flex items-center text-gray-600 gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    {event.is_virtual && event.link && (
                      <Video className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  {event.educator && (
                    <p className="text-sm text-gray-600">
                      by {event.educator.name}
                      {event.educator.title && ` - ${event.educator.title}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {event.price === 0 || event.price === null ? (
                    <Badge variant="success">FREE</Badge>
                  ) : (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">${event.price}</span>
                      <Lock className="w-4 h-4 text-gray-400 ml-1" />
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mt-2">{event.description}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                <div
                  className={`px-2.5 py-0.5 rounded-full text-sm font-medium
                  ${getEventTypeStyle(event.type).bgColor} 
                  ${getEventTypeStyle(event.type).color}`}
                >
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </div>

                <div
                  className={`px-2.5 py-0.5 rounded-full text-sm font-medium
                  ${getCategoryStyle(event.category).bgColor} 
                  ${getCategoryStyle(event.category).color}`}
                >
                  {event.category.charAt(0).toUpperCase() +
                    event.category.slice(1)}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <EventActions
                  eventId={event.id}
                  eventTitle={event.title}
                  eventDate={event.start_time}
                  eventLink={event.link}
                />
                <div className="flex gap-2">
                  {event.is_virtual && event.link ? (
                    <Button
                      variant="primary"
                      customColor={primaryColor}
                      icon={Video}
                      onClick={() => window.open(event.link!, '_blank')}
                    >
                      Join Event
                    </Button>
                  ) : (
                    <Button variant="primary" customColor={primaryColor}>
                      Register Now
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    icon={ExternalLink}
                    customColor={primaryColor}
                    onClick={() => onEventClick?.(event.id)}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Events Found</h3>
          <p className="text-gray-600 mt-2">
            Try adjusting your filters or changing the date range.
          </p>
        </div>
      )}
    </div>
  );
}
