import { useEffect, useRef } from 'react';

// Global script loading state
let isLoading = false;
let isLoaded = false;
const callbacks: (() => void)[] = [];

export function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google?.maps) {
      isLoaded = true;
      resolve();
      return;
    }

    // If currently loading, add to callback queue
    if (isLoading) {
      callbacks.push(() => resolve());
      return;
    }

    // Start loading
    isLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
      resolve();
    };

    script.onerror = () => {
      const error = new Error('Failed to load Google Maps script');
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
      reject(error);
    };

    document.head.appendChild(script);
  });
}

export function useGoogleMapsScript() {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (!window.google?.maps) {
      loadGoogleMapsScript().catch(console.error);
    }
  }, []);

  return {
    isLoaded: !!window.google?.maps,
    isLoading,
  };
}