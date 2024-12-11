import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Palette } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { setVenueTheme } from '../../../store/slices/venueThemeSlice';
import type { RootState } from '../../../store';

const fonts = [
  { id: 'cormorant', name: 'Cormorant Garamond', className: 'font-display' },
  { id: 'playfair', name: 'Playfair Display', className: 'font-playfair' },
  { id: 'lora', name: 'Lora', className: 'font-lora' },
] as const;

type FontOption = typeof fonts[number]['id'];

export default function VenueTheme() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const venueId = searchParams.get('id');

  const { primaryColor, font } = useSelector((state: RootState) => state.venueTheme);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!venueId) {
    navigate('/venue');
    return null;
  }

  const handleColorChange = (color: string) => {
    dispatch(setVenueTheme({
      primaryColor: color,
      secondaryColor: '#f472b6',
      font,
      venueId
    }));
  };

  const handleFontChange = (newFont: FontOption) => {
    dispatch(setVenueTheme({
      primaryColor,
      secondaryColor: '#f472b6',
      font: newFont,
      venueId
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error: updateError } = await supabase
        .from('venues')
        .update({
          branding: {
            colors: {
              primary: primaryColor,
              secondary: '#f472b6'
            },
            font
          }
        })
        .eq('id', venueId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error saving theme:', err);
      setError(err instanceof Error ? err.message : 'Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const fontClass = fonts.find(f => f.id === font)?.className;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error: {error}
        </div>
      )}

      <div 
        className="flex justify-between items-center rounded-2xl p-8 text-white shadow-lg"
        style={{ 
          background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}CC)`
        }}
      >
        <div className={fontClass}>
          <h1 className="text-3xl font-bold">Theme Customization</h1>
          <p className="text-white/90 mt-2">Customize your venue's branding</p>
        </div>
        <div className="p-3 bg-white/10 rounded-xl">
          <Palette className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Picker */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Primary Color</h2>
          <p className="text-gray-600">This color will be used throughout your venue's branding</p>
          
          <div className="flex flex-col items-center space-y-4">
            <HexColorPicker 
              color={primaryColor} 
              onChange={handleColorChange}
            />
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="text-sm font-mono text-gray-600 uppercase">
                {primaryColor}
              </span>
            </div>
          </div>
        </div>

        {/* Font Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Typography</h2>
          <p className="text-gray-600">Choose a font that matches your venue's style</p>
          
          <div className="space-y-4">
            {fonts.map((fontOption) => (
              <button
                key={fontOption.id}
                onClick={() => handleFontChange(fontOption.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  font === fontOption.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-xl ${fontOption.className}`}>
                  {fontOption.name}
                </span>
                <p className={`text-sm text-gray-500 mt-1 ${fontOption.className}`}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Preview</h2>
        <div className="space-y-4">
          <div 
            className={`p-6 rounded-xl border border-gray-200 ${fontClass}`}
            style={{ 
              backgroundColor: primaryColor + '10',
              borderColor: primaryColor + '30'
            }}
          >
            <h3 
              className="text-2xl mb-2"
              style={{ color: primaryColor }}
            >
              Sample Event Card
            </h3>
            <p className="text-gray-600">
              This is how your customized elements will look across your venue's dashboard.
            </p>
            <button
              className="mt-4 px-6 py-2 rounded-full text-white transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 text-white rounded-xl transition-all transform hover:scale-105 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: primaryColor }}
        >
          {saving ? 'Saving...' : 'Save Theme'}
        </button>
      </div>
    </div>
  );
}