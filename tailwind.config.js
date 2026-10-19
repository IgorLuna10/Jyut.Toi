/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '380px',
      },
      colors: {
        primary: '#C8231F', // Classic Hong Kong Red
        'primary-hover': '#a71d1a',
        
        // Hong Kong Transit Line Palettes
        mtr: {
          red: '#C8231F',       // Line 1: First Words
          teal: '#2E8B7F',      
          blue: '#0076BE',      // Line 2: City Life
          ochre: '#B8860B',     
          purple: '#6E3C8E',    
          orange: '#F37023',    
          green: '#00A040',     // Line 3: Real Talk
          pink: '#E83F6F',      
        },

        // Hong Kong Cultural & Diner Accents
        cct: {
          jade: '#00A86B',      // Jade green ceramic tile
          'jade-dark': '#007A4D',
          amber: '#F5A623',     // Silk stocking milk tea amber
          'amber-light': '#FCD34D',
          steel: '#334155',     
          paper: '#FBF8F1',     
        },

        // Wet Market Accents
        market: {
          red: '#E60012',       
          glow: '#FF3344',
          chalk: '#FFFFFF',
        },

        // Subway Slate / Dark Enamel Substrate
        subway: {
          dark: '#080A10',
          surface: '#10141F',
          card: '#161B29',
          'card-hover': '#1E2436',
          border: '#252D40',
          highlight: '#384460',
        },

        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          400: '#fb7185',
          500: '#ef4444',
          600: '#C8231F',
          700: '#991b1b',
          amber: '#f59e0b',
          glow: '#fbbf24',
          dark: '#080a0f',
          card: '#11141c',
          surface: '#161a25',
          border: '#232838'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif HK"', '"Noto Serif TC"', 'serif'],
        canto: ['"Noto Sans HK"', '"PingFang HK"', '"Microsoft JhengHei"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(200, 35, 31, 0.35)',
        'glow-red': '0 0 24px -4px rgba(200, 35, 31, 0.45)',
        'glow-teal': '0 0 20px -3px rgba(46, 139, 127, 0.4)',
        'glow-blue': '0 0 20px -3px rgba(0, 118, 190, 0.4)',
        'glow-green': '0 0 20px -3px rgba(0, 160, 64, 0.4)',
        'glow-jade': '0 0 20px -3px rgba(0, 168, 107, 0.4)',
        'glow-amber': '0 0 20px -3px rgba(245, 166, 35, 0.4)',
        'enamel': '0 8px 24px -4px rgba(0, 0, 0, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.25)',
        'enamel-plate': '0 10px 30px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 0 rgba(0, 0, 0, 0.3)',
        'tile-acrylic': '0 4px 0 #CBD5E1, 0 6px 12px rgba(0, 0, 0, 0.08)',
        'tile-acrylic-dark': '0 4px 0 #0A0D15, 0 8px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ding-ding': 'ding 0.8s ease-in-out',
        'soundwave-1': 'soundwave 1.1s ease-in-out infinite alternate',
        'soundwave-2': 'soundwave 0.8s ease-in-out 0.2s infinite alternate',
        'soundwave-3': 'soundwave 1.3s ease-in-out 0.4s infinite alternate',
        'train-jolt': 'trainJolt 0.35s ease-out',
        'card-shake': 'cardShake 0.3s ease-in-out',
      },
      keyframes: {
        ding: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        soundwave: {
          '0%': { height: '4px' },
          '100%': { height: '16px' },
        },
        trainJolt: {
          '0%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(6px)' },
          '40%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(3px)' },
          '80%': { transform: 'translateX(-1px)' },
          '100%': { transform: 'translateX(0)' },
        },
        cardShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        }
      }
    },
  },
  plugins: [],
}
