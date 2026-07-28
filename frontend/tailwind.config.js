/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B4F3B',
          dark: '#4A3527',
          light: '#8B6A52',
        },
        accent: {
          gold: '#C9A227',
          light: '#F4E9C1',
        },
        sage: {
          DEFAULT: '#7C8B6F',
          light: '#DCE2D5',
        },
        ink: {
          DEFAULT: '#1F1B16',
          muted: '#766F63',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          warm: '#FBF8F3',
          card: '#FFFFFF',
        },
        success: '#3E7B4F',
        danger: '#B5473A',
      },
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'button': '8px',
        'input': '8px',
        'card': '12px',
        'modal': '20px',
        'drawer': '20px',
      },
      boxShadow: {
        'premium': '0 8px 24px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 12px 32px rgba(0, 0, 0, 0.09)',
      },
      keyframes: {
        bounceCart: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.28)' },
          '60%': { transform: 'scale(0.92)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'bounce-cart': 'bounceCart 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}
