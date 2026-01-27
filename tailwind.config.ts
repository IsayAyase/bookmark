import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'zoom-in': {
          '0%': { transform: 'translate(-50%, -50%) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
        },
        'zoom-out': {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(-50%, -50%) scale(0.95)', opacity: '0' },
        },
        'slide-in-from-left': {
          '0%': { transform: 'translateX(-50%) translateY(-48%)', opacity: '0' },
          '100%': { transform: 'translateX(-50%) translateY(-50%)', opacity: '1' },
        },
        'slide-out-to-left': {
          '0%': { transform: 'translateX(-50%) translateY(-50%)', opacity: '1' },
          '100%': { transform: 'translateX(-50%) translateY(-48%)', opacity: '0' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateX(-50%) translateY(-45%)', opacity: '0' },
          '100%': { transform: 'translateX(-50%) translateY(-50%)', opacity: '1' },
        },
        'slide-out-to-top': {
          '0%': { transform: 'translateX(-50%) translateY(-50%)', opacity: '1' },
          '100%': { transform: 'translateX(-50%) translateY(-45%)', opacity: '0' },
        },
      },
      animation: {
        'animate-in': 'zoom-in 0.2s ease-out',
        'animate-out': 'zoom-out 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.2s ease-out',
        'slide-out-to-left': 'slide-out-to-left 0.2s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.2s ease-out',
        'slide-out-to-top': 'slide-out-to-top 0.2s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config