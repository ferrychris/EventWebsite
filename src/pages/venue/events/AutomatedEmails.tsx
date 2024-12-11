import React, { useState, useEffect } from 'react';
import { Plus, Mail, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../../config/supabase';
import type { RootState } from '../../../store';
import type { EmailTemplate } from '../../../types';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import TemplateManager from './components/email/TemplateManager';
import EmailHistory from './components/email/EmailHistory';

export default function AutomatedEmails() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);
  const [activeView, setActiveView] = useState<'templates' | 'history'>('templates');

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-4">
        <Button
          variant={activeView === 'templates' ? 'primary' : 'outline'}
          onClick={() => setActiveView('templates')}
          icon={Mail}
          style={activeView === 'templates' ? { backgroundColor: primaryColor } : undefined}
        >
          Email Templates
        </Button>
        <Button
          variant={activeView === 'history' ? 'primary' : 'outline'}
          onClick={() => setActiveView('history')}
          icon={Mail}
          style={activeView === 'history' ? { backgroundColor: primaryColor } : undefined}
        >
          Sent Emails
        </Button>
      </div>

      {/* Content */}
      {activeView === 'templates' ? (
        <TemplateManager />
      ) : (
        <EmailHistory />
      )}
    </div>
  );
}