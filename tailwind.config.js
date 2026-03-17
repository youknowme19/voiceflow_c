/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0B0F',
          secondary: '#11111A',
          tertiary: '#1A1A24',
        },
        accent: {
          purple: '#6C63FF',
          cyan: '#00D4FF',
          pink: '#FF6B9D',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          medium: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Satoshi', 'Geist', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Geist', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)',
        'gradient-glow': 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass-sm': '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.05)',
        'glass-md': '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.05)',
        'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.05)',
        'glow-purple': '0 0 20px rgba(108, 99, 255, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
