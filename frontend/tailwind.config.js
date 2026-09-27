/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'site': '1680px',
        'site-wide': '1760px',
      },
      colors: {
        canvas: {
          DEFAULT: '#fafaf9', // Warm, editorial neutral canvas
          subtle: '#f4f4f5',  // Subtle container & image backgrounds
        },
        ink: {
          primary: '#18181b',   // Near-black charcoal
          secondary: '#52525b', // Balanced neutral gray
          muted: '#71717a',     // Metadata gray
          faint: '#a1a1aa',     // Borders and dividers
        },
        accent: {
          DEFAULT: '#0f172a',   // Deep authoritative slate
          hover: '#1e293b',
          subtle: '#f1f5f9',
          brand: '#2563eb',     // Restrained primary action blue
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 6px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'modal': '0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
