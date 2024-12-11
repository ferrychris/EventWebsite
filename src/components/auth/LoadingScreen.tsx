import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  timeout?: number;
  onTimeout?: () => void;
}

export default function LoadingScreen({ timeout = 10000, onTimeout }: LoadingScreenProps) {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDebug(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Loading...</p>
        {showDebug && onTimeout && (
          <button
            onClick={onTimeout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Taking too long? Click here to try again
          </button>
        )}
      </div>
    </div>
  );
}