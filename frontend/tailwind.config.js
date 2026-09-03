/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#60A5FA',
          glow: 'rgba(37, 99, 235, 0.3)',
        },
        secondary: {
          DEFAULT: '#0F172A',
          card: '#1E293B',
          hover: '#334155',
        },
        accent: {
          DEFAULT: '#14B8A6',
          hover: '#0D9488',
          glow: 'rgba(20, 184, 166, 0.3)',
        },
        cyber: {
          dark: '#0B0F17',
          surface: '#111827',
          border: '#1F2937',
          danger: '#EF4444',
          warning: '#F59E0B',
          success: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'cyber-glow': '0 0 25px -5px rgba(37, 99, 235, 0.4)',
        'accent-glow': '0 0 25px -5px rgba(20, 184, 166, 0.4)',
        'danger-glow': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
