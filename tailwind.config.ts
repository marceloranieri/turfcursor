import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  safelist: [
    // Spacing utilities
    'p-3', 'px-4', 'py-2', 'px-2', 'py-1', 'my-1', 'my-2', 'mr-1', 'pb-16',
    
    // Flex and grid utilities
    'flex', 'flex-col', 'grid', 'grid-cols-12', 'inline-flex', 'items-center', 'justify-around',
    
    // Sizing utilities
    'h-screen', 'w-screen', 'h-full', 'col-span-1', 'col-span-2', 'col-span-3', 'col-span-8', 'col-span-9',
    
    // Border and rounding utilities
    'rounded-lg', 'rounded-md', 'rounded-full', 'border', 'border-l-4', 'border-2', 'outline-none',
    
    // Typography utilities
    'font-medium', 'text-xs',
    
    // Positioning utilities
    'fixed', 'bottom-0', 'left-0', 'right-0',
    
    // Visual utilities
    'transition-colors', 'brightness-90', 'overflow-y-auto', 'overflow-hidden',

    // Discord UI specific classes
    'server-sidebar', 'channels-sidebar', 'chat-container', 'members-list', 'mobile-nav',
    'server-icon', 'channel', 'active', 'message-group', 'message-avatar', 'message-content',
    'pinned-message', 'mobile-nav-item', 'mobile-nav-icon'
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
          primary: 'var(--background-primary)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
        },
        gold: 'var(--gold)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',
      },
      screens: {
        'mobile': {'max': '768px'},
        'tablet': {'min': '769px', 'max': '1280px'},
        'desktop': {'min': '1281px'},
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'SF Pro', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'message': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'elevated': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'message': '8px',
        'button': '8px',
        'input': '8px',
        'card': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config; 