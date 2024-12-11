/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Cormorant', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        lora: ['Lora', 'serif']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.04)',
        'glass-hover': '0 8px 32px rgba(0, 0, 0, 0.08)'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out'
      }
    }
  },
  plugins: []
};