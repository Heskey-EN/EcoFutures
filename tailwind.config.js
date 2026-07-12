/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Ground + ink — a cool "drafting paper" neutral, not a default grey
        paper: { DEFAULT: '#EDF1F3', warm: '#F4F1EA', card: '#FBFCFD' },
        ink: { DEFAULT: '#16202B', soft: '#3C4A57', faint: '#6B7885' },

        // Brand surfaces (keeps the navy logo lockup working)
        navy: { DEFAULT: '#0D1B2A', deep: '#081521' },

        // Ember = heat loss + primary action.  Moss = upgraded / efficient.
        ember: { DEFAULT: '#E4572E', soft: '#F0703F', deep: '#B83C18' },
        moss: { DEFAULT: '#2E7D4F', soft: '#3E9A63', deep: '#1F5E39' },
        amber: { DEFAULT: '#E8B23A' },

        // Thermal-imaging scale for the interactive house (cool → hot)
        thermal: {
          cool: '#2C6E9C',
          good: '#4FA36B',
          warm: '#E8B23A',
          hot: '#E4572E',
          peak: '#B0342A',
        },

        // Legacy tokens — retained so the private /hub pages keep their styling
        brand: { blue: '#1a365d' },
        accent: { orange: '#ff6b00', yellow: '#ffcc00', green: '#4caf50' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        site: '1240px',
        prose: '68ch',
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
        xl: '12px',
        '2xl': '18px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,32,43,0.04), 0 8px 30px -12px rgba(22,32,43,0.14)',
        lift: '0 12px 40px -12px rgba(22,32,43,0.28)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.5' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
      },
    },
  },
  plugins: [],
}
