import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, AlertCircle, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../../../../config/supabase';
import type { RootState } from '../../../../../store';
import type { EmailTemplate } from '../../../../../types';
import Card from '../../../../../components/common/Card';
import Button from '../../../../../components/common/Button';
import TemplateModal from './TemplateModal';

// Rest of the file remains exactly the same
export default function TemplateManager() {
  const [searchParams] = useSearchParams();
  const venueId = searchParams.get('id');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  useEffect(() => {
    fetchTemplates();
  }, [venueId]);

  async function fetchTemplates() {
    if (!venueId) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('email_templates')
        .select('*')
        .eq('venue_id', venueId);

      if (fetchError) throw fetchError;
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    }
  }

  const handleDelete = async (templateId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', templateId);

      if (deleteError) throw deleteError;
      setTemplates(templates.filter(t => t.id !== templateId));
    } catch (err) {
      console.error('Error deleting template:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateForm(true)}
            style={{ backgroundColor: primaryColor }}
          >
            Create Template
          </Button>
        </div>

        <div className="space-y-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.trigger === 'on_rsvp_yes' ? 'Sent automatically on RSVP confirmation' :
                     template.trigger === 'on_rsvp_no' ? 'Sent automatically on RSVP decline' :
                     'Manual template'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Subject: {template.subject}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No email templates yet</p>
              <p className="text-sm text-gray-500 mt-1">Create your first template to get started</p>
            </div>
          )}
        </div>
      </Card>

      {/* Template Modal */}
      {(showCreateForm || editingTemplate) && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setEditingTemplate(null);
            setShowCreateForm(false);
          }}
          onSave={async (template) => {
            await fetchTemplates();
            setEditingTemplate(null);
            setShowCreateForm(false);
          }}
        />
      )}
    </div>
  );
}