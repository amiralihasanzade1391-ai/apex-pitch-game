/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apex Pitch Design System
        'canvas-dark': '#0A0E1A',
        'surface-base': '#121829',
        'surface-elevated': '#1A2238',
        'surface-high': '#262a37',
        'surface-highest': '#313442',
        'gold': '#D4AF37',
        'gold-bright': '#FFDF00',
        'gold-dim': '#B38F24',
        'gold-muted': '#C9962E',
        'teal': '#17D3C2',
        'teal-dim': '#00ccbb',
        'emerald-pitch': '#10B981',
        'danger': '#E5484D',
        'danger-dim': '#93000a',
        'on-surface': '#DFE2F3',
        'on-surface-muted': '#D0C5AF',
        'border-gold': 'rgba(212,175,55,0.25)',
        'border-subtle': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'sans-serif'],
        'body': ['Outfit', 'sans-serif'],
        'persian': ['Vazirmatn', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 50%, #B38F24 100%)',
        'gold-card': 'linear-gradient(160deg, #2a2000 0%, #1a1500 40%, #0f0e00 100%)',
        'pitch-bg': 'radial-gradient(ellipse at 50% 0%, rgba(23,211,194,0.06) 0%, transparent 65%)',
        'card-shimmer': 'linear-gradient(135deg, rgba(255,223,0,0.15) 0%, rgba(212,175,55,0.08) 50%, rgba(0,0,0,0) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 24px -4px rgba(212,175,55,0.3), inset 0 1px 0 0 rgba(255,223,0,0.4)',
        'teal-glow': '0 0 20px 0 rgba(23,211,194,0.45)',
        'card-gold': '0 0 32px -8px rgba(212,175,55,0.5)',
        'inner-gold': 'inset 0 1px 0 rgba(255,223,0,0.3)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-heavy': '24px',
      },
      borderRadius: {
        'card': '8px',
        'panel': '4px',
      },
      animation: {
        'card-flip': 'cardFlip 0.6s ease-out forwards',
        'sold-stamp': 'soldStamp 0.4s cubic-bezier(0.68,-0.55,0.265,1.55) forwards',
        'pulse-teal': 'pulseTeal 2s ease-in-out infinite',
        'count-up': 'countUp 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'confetti-fall': 'confettiFall linear forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        cardFlip: {
          '0%': { transform: 'rotateY(90deg) scale(0.8)', opacity: '0' },
          '60%': { transform: 'rotateY(-10deg) scale(1.05)', opacity: '1' },
          '100%': { transform: 'rotateY(0deg) scale(1)', opacity: '1' },
        },
        soldStamp: {
          '0%': { transform: 'scale(2) rotate(-15deg)', opacity: '0' },
          '60%': { transform: 'scale(0.9) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-5deg)', opacity: '1' },
        },
        pulseTeal: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(23,211,194,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(23,211,194,0.7)' },
        },
        countUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
