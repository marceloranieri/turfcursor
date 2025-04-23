import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
    'transition-colors', 'brightness-90', 'overflow-y-auto', 'overflow-hidden'
  ],
  theme: {
    extend: {
      colors: {
        'background': {
          DEFAULT: '#2C2F33', // Discord dark gray
          'secondary': '#23272A', // Darker gray
          'tertiary': '#202225', // Almost black
        },
        'text': {
          'primary': '#FFFFFF', // White
          'secondary': '#B9BBBE', // Light gray
          'muted': '#72767D', // Medium gray
        },
        'accent': {
          'primary': '#FFD700', // Gold
          'secondary': '#2F80ED', // Bright blue
        },
        'gold': '#FFD700',
        'success': '#57F287', // Discord green
        'danger': '#ED4245', // Discord red
        'warning': '#FEE75C', // Discord yellow
      },
      screens: {
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1279px'},
        'desktop': {'min': '1280px'},
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'SF Pro', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'message': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'message': '4px',
        'button': '4px',
        'input': '4px',
      },
    },
  },
  plugins: [],
};
export default config; 