// src/types/venue.ts

export interface VenueAddress {
  formatted_address: string;
  street_number?: string;
  route?: string;
  locality: string;
  administrative_area_level_1: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface VenueSocialMedia {
  instagram: string;
  facebook: string;
  tiktok: string;
}

export interface VenueContactInfo {
  primary_contact: string;
  phone: string;
  alternate_email: string;
}

export interface VenueAmenity {
  id: string;
  name: string;
  description?: string;
  included: boolean;
}

export interface VenueFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface VendorCategory {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
}

export interface Vendor {
  id: string;
  category_id: string;
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  social_media: VenueSocialMedia;
  featured: boolean;
  sort_order: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  alt_text?: string;
  category?: string;
  featured: boolean;
  sort_order: number;
}

// Education Event Types
export type EducationEventType =
  | 'webinar'
  | 'workshop'
  | 'vacation'
  | 'thirdParty';
export type EducationCategory =
  | 'marketing'
  | 'operations'
  | 'sales'
  | 'technology'
  | 'finance';
export type EducationEventStatus = 'upcoming' | 'live' | 'past' | 'cancelled';

export interface EducationEvent {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  type: EducationEventType;
  category: EducationCategory;
  speaker: string;
  speaker_title: string | null;
  speaker_bio: string | null;
  is_virtual: boolean;
  location: string | null;
  link: string | null;
  price: number | null;
  max_participants: number | null;
  registration_deadline: string | null;
  status: EducationEventStatus;
  cover_image: string | null;
  resources: Record<string, any> | null;
  recording_url: string | null;
  is_featured: boolean;
  sort_order: number;
}

export interface EducationEventRegistration {
  id: string;
  created_at: string;
  event_id: string;
  venue_id: string;
  status: string;
  paid: boolean;
  payment_id: string | null;
  notes: string | null;
}

// Component Props
export interface CalendarViewProps {
  events: EventWithEducator[];
  selectedTimezone: string;
  onEventClick?: (eventId: string) => void;
}

export interface EventListProps {
  events: EventWithEducator[];
  selectedTimezone: string;
  onEventClick?: (eventId: string) => void;
}

export interface EventDetailModalProps {
  event: EventWithEducator;
  onClose: () => void;
  selectedTimezone: string;
}

export interface EventActionsProps {
  eventId: string;
  eventTitle: string;
  eventDate: string; // To match the database timestamp string
  eventLink: string | null; // To match the database nullable field
}

export type EducatorSpecialty =
  | 'marketing'
  | 'operations'
  | 'sales'
  | 'technology'
  | 'finance';

export interface Educator {
  id: string;
  created_at: string;
  name: string;
  title: string | null;
  bio: string | null;
  profile_image: string | null;
  website: string | null;
  social_media: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  email: string | null;
  specialty: EducatorSpecialty[];
  is_featured: boolean;
  sort_order: number;
}

// Update EducationEvent to use educator_id instead of speaker fields
export interface EducationEvent {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  timezone: string;
  type: EducationEventType;
  category: EducationCategory;
  educator_id: string;
  is_virtual: boolean;
  location: string | null;
  link: string | null;
  price: number | null;
  max_participants: number | null;
  registration_deadline: string | null;
  status: EducationEventStatus;
  cover_image: string | null;
  resources: Record<string, any> | null;
  recording_url: string | null;
  is_featured: boolean;
  sort_order: number;
}

// Add this interface
export interface EventWithEducator extends EducationEvent {
  educator: {
    id: string;
    name: string;
    title: string | null;
    profile_image: string | null;
  };
}

// Then update your existing EventListProps
export interface EventListProps {
  events: EventWithEducator[];
  selectedTimezone: string;
  onEventClick?: (eventId: string) => void;
}
