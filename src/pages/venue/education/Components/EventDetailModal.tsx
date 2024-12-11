import { X, MapPin, Video, DollarSign, Lock, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';
import type { EventDetailModalProps } from '../../../../types/venue';
import Button from '../../../../components/common/Button';
import EventActions from './EventActions';

export default function EventDetailModal({
  event,
  onClose,
  selectedTimezone,
}: EventDetailModalProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  const formatDateTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: selectedTimezone,
        timeZoneName: 'short',
      }).format(new Date(dateString));
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const getDuration = () => {
    try {
      const start = new Date(event.start_time);
      const end = new Date(event.end_time);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return hours === 1 ? '1 hour' : `${hours} hours`;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 'Duration not available';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {event.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              by {event.speaker}
              {event.speaker_title && ` - ${event.speaker_title}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Details */}
        <div className="space-y-6">
          {/* Time & Location */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">
                  {formatDateTime(event.start_time)}
                </div>
                <div className="text-sm text-gray-600">
                  Duration: {getDuration()}
                </div>
              </div>
            </div>
            {event.is_virtual ? (
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-500" />
                <span>Virtual Event</span>
              </div>
            ) : event.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{event.location}</span>
              </div>
            ) : null}
          </div>

          {/* Price */}
          {(event.price ?? 0) > 0 && (
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="font-medium text-amber-900">
                    Registration Required
                  </div>
                  <div className="text-sm text-amber-700">
                    Investment: ${event.price}
                  </div>
                </div>
              </div>
              <Lock className="w-5 h-5 text-amber-600" />
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">About this event</h3>
            <div className="text-gray-600 space-y-4 prose">
              {event.description}
            </div>
          </div>

          {/* Additional Details */}
          {event.speaker_bio && (
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-2">
                About the Speaker
              </h3>
              <div className="text-gray-600">{event.speaker_bio}</div>
            </div>
          )}

          {/* Resources */}
          {event.resources && Object.keys(event.resources).length > 0 && (
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
              <div className="space-y-2">
                {Object.entries(event.resources).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-blue-600">•</span>
                    </div>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8">
          <EventActions
            eventId={event.id}
            eventTitle={event.title}
            eventDate={event.start_time}
            eventLink={event.link}
          />
          <div className="flex gap-3">
            {event.is_virtual && event.link ? (
              <Button
                variant="primary"
                style={{ backgroundColor: primaryColor }}
                icon={Video}
                onClick={() => window.open(event.link!, '_blank')}
              >
                Join Event
              </Button>
            ) : (
              <Button
                variant="primary"
                style={{ backgroundColor: primaryColor }}
              >
                Register Now
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
