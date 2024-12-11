import React from 'react';
import { Input } from '../../../../components/common';
import type { VenueContactInfo } from '../../../../types/venue';

interface ContactFormProps {
  contactInfo: VenueContactInfo;
  onContactInfoChange: (info: VenueContactInfo) => void;
  primaryColor?: string;
}

export default function ContactForm({ contactInfo, onContactInfoChange, primaryColor = '#1e40af' }: ContactFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Primary Contact Name"
        value={contactInfo.primary_contact}
        onChange={(e) => onContactInfoChange({ ...contactInfo, primary_contact: e.target.value })}
        placeholder="Enter contact name"
      />

      <Input
        label="Phone Number"
        type="tel"
        value={contactInfo.phone}
        onChange={(e) => onContactInfoChange({ ...contactInfo, phone: e.target.value })}
        placeholder="(555) 123-4567"
      />

      <Input
        label="Alternate Email"
        type="email"
        value={contactInfo.alternate_email}
        onChange={(e) => onContactInfoChange({ ...contactInfo, alternate_email: e.target.value })}
        placeholder="alternate@example.com"
      />
    </div>
  );
}