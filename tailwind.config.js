/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          primary: 'var(--background-primary)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          'primary-hover': 'rgba(255, 215, 0, 0.9)',
          secondary: 'var(--accent-secondary)',
          'secondary-light': 'rgba(47, 128, 237, 0.5)',
        },
        gold: 'var(--gold)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
        ring: {
          DEFAULT: 'var(--accent-secondary)',
          light: 'rgba(47, 128, 237, 0.5)',
        },
      },
      borderRadius: {
        'message': '0.5rem',
        'button': '0.375rem',
        'input': '0.375rem',
        'card': '0.75rem',
      },
      boxShadow: {
        'message': 'var(--shadow-sm)',
        'card': 'var(--shadow-md)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 