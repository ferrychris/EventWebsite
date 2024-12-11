import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Select from '../../../components/common/Select';
import CalendarView from './Components/CalendarView';
import EventList from './Components/EventList';
import EventDetailModal from './Components/EventDetailModal';
import { fetchEducationEvents } from '../../../services/educationService';
import type {
  EducationEvent,
  EducationEventType,
  EducationCategory,
} from '../../../types/venue';

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
];

export default function Calendar() {
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  // State
  const [events, setEvents] = useState<EducationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'calendar' | 'list'>('list');
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[0].value);
  const [selectedTypes, setSelectedTypes] = useState<EducationEventType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<
    EducationCategory[]
  >([]);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState<string | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      setError(null);

      const { data, error } = await fetchEducationEvents();

      if (error) {
        setError(error);
      } else if (data) {
        setEvents(data);
      }

      setLoading(false);
    }

    loadEvents();
  }, []);

  const handleViewChange = (newView: 'calendar' | 'list') => {
    setView(newView);
  };

  const toggleType = (type: EducationEventType) => {
    setSelectedTypes((prev: EducationEventType[]) =>
      prev.includes(type)
        ? prev.filter((t: EducationEventType) => t !== type)
        : [...prev, type]
    );
  };

  const toggleCategory = (category: EducationCategory) => {
    setSelectedCategories((prev: EducationCategory[]) =>
      prev.includes(category)
        ? prev.filter((c: EducationCategory) => c !== category)
        : [...prev, category]
    );
  };

  const handleEventClick = (eventId: string) => {
    setShowEventDetail(eventId);
  };

  // Get sorted and filtered events
  const getSortedAndFilteredEvents = () => {
    let filteredEvents = [...events];

    if (selectedTypes.length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        selectedTypes.includes(event.type)
      );
    }

    if (selectedCategories.length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        selectedCategories.includes(event.category)
      );
    }

    return filteredEvents.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (
            new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
          );
        case 'price':
          return (a.price ?? 0) - (b.price ?? 0);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const sortedAndFilteredEvents = getSortedAndFilteredEvents();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading events...</div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error loading events: {error}</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={view === 'calendar' ? 'primary' : 'outline'}
              onClick={() => handleViewChange('calendar')}
              icon={CalendarIcon}
              customColor={primaryColor}
            >
              Calendar
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'outline'}
              onClick={() => handleViewChange('list')}
              icon={List}
              customColor={primaryColor}
            >
              List
            </Button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Timezone Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Timezone:</span>
              <Select
                value={selectedTimezone}
                onChange={(value) => setSelectedTimezone(value)}
                options={TIMEZONES}
                className="w-48"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select
                value={sortBy}
                onChange={(value) =>
                  setSortBy(value as 'date' | 'price' | 'name')
                }
                options={[
                  { value: 'date', label: 'Date' },
                  { value: 'price', label: 'Price' },
                  { value: 'name', label: 'Name' },
                ]}
                className="w-32"
              />
            </div>

            {/* Filter Toggle */}
            {/* Filter Toggle */}
            <Button
              variant="outline"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
              customColor={primaryColor}
              className={
                showFilters
                  ? `border-2 border-[${primaryColor}] text-[${primaryColor}] bg-[${primaryColor}10]`
                  : ''
              }
            >
              Filters
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="mb-6 pt-6 border-t">
            <div className="space-y-4">
              {/* Event Type Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['webinar', 'workshop', 'vacation', 'thirdParty'].map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => toggleType(type as EducationEventType)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                        ${
                          selectedTypes.includes(type as EducationEventType)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Category Filters */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'marketing',
                    'operations',
                    'sales',
                    'technology',
                    'finance',
                  ].map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        toggleCategory(category as EducationCategory)
                      }
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                        ${
                          selectedCategories.includes(
                            category as EducationCategory
                          )
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {view === 'calendar' ? (
          <CalendarView
            events={sortedAndFilteredEvents}
            selectedTimezone={selectedTimezone}
            onEventClick={handleEventClick}
          />
        ) : (
          <EventList
            events={sortedAndFilteredEvents}
            selectedTimezone={selectedTimezone}
            onEventClick={handleEventClick}
          />
        )}

        {/* Event Detail Modal */}
        {showEventDetail && (
          <EventDetailModal
            event={events.find((e) => e.id === showEventDetail)!}
            onClose={() => setShowEventDetail(null)}
            selectedTimezone={selectedTimezone}
          />
        )}
      </Card>
    </div>
  );
}
