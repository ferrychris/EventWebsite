import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { DollarSign, Video, Lock, Clock, MapPin } from 'lucide-react';
import type { RootState } from '../../../../store';
import type { CalendarViewProps } from '../../../../types/venue';
import type { EventContentArg } from '@fullcalendar/core';

export default function CalendarView({
  events,
  selectedTimezone,
  onEventClick,
}: CalendarViewProps) {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start_time).toISOString(),
    end: new Date(event.end_time).toISOString(),
    backgroundColor: 'white',
    textColor: 'black',
    borderColor: primaryColor,
    extendedProps: {
      description: event.description,
      speaker: event.speaker,
      type: event.type,
      category: event.category,
      price: event.price,
      location: event.location,
      link: event.link,
      isVirtual: event.is_virtual,
      speaker_title: event.speaker_title,
    },
  }));

  // Event type colors for badges only
  function getEventTypeColor(type: string): string {
    const colors = {
      webinar: '#3b82f6', // blue
      workshop: '#8b5cf6', // purple
      vacation: '#10b981', // green
      thirdParty: '#f97316', // orange
    };
    return colors[type as keyof typeof colors] || '#64748b';
  }

  function formatEventTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: selectedTimezone,
    }).format(date);
  }

  const renderEventContent = (eventInfo: EventContentArg) => {
    const { event } = eventInfo;
    const { price, link, isVirtual, speaker, speaker_title, location, type } =
      event.extendedProps;
    const startTime = new Date(event.start.valueOf());
    const typeColor = getEventTypeColor(type);

    return (
      <div
        className="flex flex-col gap-1 p-2 h-full w-full hover:bg-gray-50 transition-colors rounded-lg cursor-pointer"
        style={{ borderLeft: `4px solid ${primaryColor}` }}
      >
        {/* Title */}
        <div className="font-medium text-gray-900 truncate">{event.title}</div>

        {/* Time and Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{formatEventTime(startTime)}</span>
          {isVirtual ? (
            <Video className="w-3 h-3" style={{ color: primaryColor }} />
          ) : location ? (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{location}</span>
            </div>
          ) : null}
        </div>

        {/* Speaker Info */}
        <div className="text-sm text-gray-600 truncate">
          {speaker}
          {speaker_title && (
            <span className="text-gray-500"> - {speaker_title}</span>
          )}
        </div>

        {/* Price and Type Indicators */}
        <div className="flex items-center gap-2 mt-1">
          {price === 0 || price === null ? (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
              FREE
            </span>
          ) : (
            <div className="flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
              <DollarSign className="w-3 h-3" />
              <span>{price}</span>
            </div>
          )}
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${typeColor}20`,
              color: typeColor,
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[800px] bg-white rounded-lg">
      <style>
        {`
          .fc .fc-button-primary {
            background-color: ${primaryColor};
            border-color: ${primaryColor};
          }
          .fc .fc-button-primary:disabled {
            background-color: #e5e7eb;
            border-color: #e5e7eb;
          }
          .fc .fc-button-primary:not(:disabled):hover {
            background-color: ${primaryColor}dd;
            border-color: ${primaryColor}dd;
          }
          .fc .fc-button-primary:not(:disabled).fc-button-active,
          .fc .fc-button-primary:not(:disabled):active {
            background-color: ${primaryColor}cc;
            border-color: ${primaryColor}cc;
          }
          .fc .fc-daygrid-day.fc-day-today {
            background-color: ${primaryColor}11;
          }
          .fc a {
            color: ${primaryColor};
          }
        `}
      </style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,listWeek',
        }}
        events={calendarEvents}
        eventContent={renderEventContent}
        eventClick={(info) => onEventClick?.(info.event.id)}
        timeZone={selectedTimezone}
        height="100%"
        firstDay={0}
        displayEventEnd={true}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        dayMaxEvents={3}
        eventDisplay="block"
        nowIndicator={true}
        views={{
          dayGridMonth: {
            dayMaxEvents: 3,
            eventMinHeight: 100,
          },
          timeGridWeek: {
            dayMaxEvents: true,
            slotMinTime: '08:00:00',
            slotMaxTime: '20:00:00',
          },
        }}
      />
    </div>
  );
}
