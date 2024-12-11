import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../../../../config/supabase';
import type { RootState } from '../../../../../store';
import type { EmailTemplate } from '../../../../../types';
import Button from '../../../../../components/common/Button';
import RichTextEditor from './RichTextEditor';

interface TemplateModalProps {
  template?: EmailTemplate | null;
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
}

export default function TemplateModal({ template, onClose, onSave }: TemplateModalProps) {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    content: template?.content || '',
    trigger: template?.trigger || 'manual'
  });

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueId) return;

    setSaving(true);
    try {
      if (template) {
        // Update existing template
        const { data, error: updateError } = await supabase
          .from('email_templates')
          .update({
            name: formData.name,
            subject: formData.subject,
            content: formData.content,
            trigger: formData.trigger
          })
          .eq('id', template.id)
          .select()
          .single();

        if (updateError) throw updateError;
        if (data) onSave(data);
      } else {
        // Create new template
        const { data, error: createError } = await supabase
          .from('email_templates')
          .insert({
            venue_id: venueId,
            name: formData.name,
            subject: formData.subject,
            content: formData.content,
            trigger: formData.trigger
          })
          .select()
          .single();

        if (createError) throw createError;
        if (data) onSave(data);
      }
    } catch (err) {
      console.error('Error saving template:', err);
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {template ? 'Edit Template' : 'Create Template'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Template Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject Line
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trigger
            </label>
            <select
              value={formData.trigger}
              onChange={(e) => setFormData({ ...formData, trigger: e.target.value as EmailTemplate['trigger'] })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:border-transparent"
              style={{ 
                '--tw-ring-color': primaryColor,
                '--tw-ring-opacity': 0.2
              } as React.CSSProperties}
            >
              <option value="manual">Manual Use Only</option>
              <option value="on_rsvp_yes">Send Automatically on RSVP Confirmation</option>
              <option value="on_rsvp_no">Send Automatically on RSVP Decline</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Content
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: primaryColor }}
            >
              {saving ? 'Saving...' : template ? 'Save Changes' : 'Create Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}