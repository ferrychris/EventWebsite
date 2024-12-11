import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Mail, Check, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { supabase } from '../../../../../config/supabase';
import type { RootState } from '../../../../../store';
import type { SentEmail } from '../../../../../types';
import Card from '../../../../../components/common/Card';

export default function EmailHistory() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  useEffect(() => {
    async function fetchEmails() {
      if (!venueId) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('sent_emails')
          .select('*')
          .eq('venue_id', venueId)
          .order('sent_at', { ascending: false });

        if (fetchError) throw fetchError;
        setEmails(data || []);
      } catch (err) {
        console.error('Error fetching email history:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch email history');
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, [venueId]);

  if (loading) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading email history...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {emails.map(email => (
          <div
            key={email.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-gray-900">{email.subject}</h3>
                </div>
                <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {email.content}
                </div>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">
                    {new Date(email.sent_at).toLocaleString()}
                  </span>
                  <span className="text-gray-500">
                    {email.recipients} recipients
                  </span>
                  <span className={`flex items-center ${
                    email.status === 'sent' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {email.status === 'sent' ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Sent
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 mr-1" />
                        Failed
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {emails.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No emails sent yet</p>
          </div>
        )}
      </div>
    </Card>
  );
}