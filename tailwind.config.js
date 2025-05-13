/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: '#3B82F6',
          primary: '#3B82F6',
          'primary-dark': '#2563eb',
        },
        background: {
          DEFAULT: '#FFFFFF',
          primary: '#FFFFFF',
          secondary: '#F3F4F6',
          tertiary: '#E5E7EB',
        },
        text: {
          DEFAULT: '#111827',
          primary: '#111827',
          secondary: '#4B5563',
          muted: '#6B7280',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#374151',
        },
        ring: {
          DEFAULT: '#E5E7EB',
          accent: '#3B82F6',
        },
        destructive: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF",
        },
        input: 'hsl(var(--input))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        card: '1rem',
        button: '0.5rem',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function({ addBase }) {
      addBase({
        ':root': {
          '--accent-opacity-10': '0.1',
          '--accent-opacity-20': '0.2',
          '--accent-opacity-30': '0.3',
          '--accent-opacity-40': '0.4',
          '--accent-opacity-50': '0.5',
          '--accent-opacity-60': '0.6',
          '--accent-opacity-70': '0.7',
          '--accent-opacity-80': '0.8',
          '--accent-opacity-90': '0.9',
          '--background-opacity': '1',
          '--text-opacity': '1',
        },
      });
    },
  ],
} 