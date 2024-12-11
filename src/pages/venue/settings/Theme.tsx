import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HexColorPicker } from 'react-colorful';
import Card from '../../../components/common/Card';
import type { RootState } from '../../../store';
import { setVenueTheme } from '../../../store/slices/venueThemeSlice';

export default function Theme() {
  const dispatch = useDispatch();
  const { primaryColor, font } = useSelector((state: RootState) => state.venueTheme);

  const fonts = [
    { id: 'cormorant', name: 'Cormorant Garamond', className: 'font-display' },
    { id: 'playfair', name: 'Playfair Display', className: 'font-playfair' },
    { id: 'lora', name: 'Lora', className: 'font-lora' }
  ] as const;

  const handleColorChange = (color: string) => {
    dispatch(setVenueTheme({
      primaryColor: color,
      secondaryColor: '#f472b6',
      font,
      venueId: null
    }));
  };

  const handleFontChange = (newFont: typeof fonts[number]['id']) => {
    dispatch(setVenueTheme({
      primaryColor,
      secondaryColor: '#f472b6',
      font: newFont,
      venueId: null
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Picker */}
        <Card title="Primary Color">
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
        </Card>

        {/* Font Selector */}
        <Card title="Typography">
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
        </Card>
      </div>
    </div>
  );
}