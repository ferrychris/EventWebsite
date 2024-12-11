import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface SaveButtonProps {
  saving: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SaveButton({ saving, onClick, className = '' }: SaveButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { primaryColor } = useSelector((state: RootState) => state.venueTheme);

  // Show success message when saving completes
  useEffect(() => {
    if (!saving && showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saving, showSuccess]);

  // Update success state when saving completes
  useEffect(() => {
    if (!saving) {
      setShowSuccess(true);
    }
  }, [saving]);

  return (
    <div className={`fixed bottom-8 right-8 flex items-center gap-3 z-50 ${className}`}>
      {/* Success Message */}
      {showSuccess && !saving && (
        <div 
          className="px-4 py-2 rounded-lg text-white shadow-lg animate-slide-up"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Changes saved successfully</span>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        type="submit"
        disabled={saving}
        onClick={onClick}
        className="px-6 py-2.5 text-white rounded-lg hover:opacity-90 disabled:opacity-50 
          transition-opacity shadow-lg flex items-center gap-2"
        style={{ backgroundColor: primaryColor }}
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <span>Save Changes</span>
        )}
      </button>
    </div>
  );
}