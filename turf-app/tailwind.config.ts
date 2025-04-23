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
        background: "var(--background)",
        "background-secondary": "var(--background-secondary)",
        "background-tertiary": "var(--background-tertiary)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        success: "var(--success)",
        danger: "var(--danger)",
        warning: "var(--warning)",
      },
      screens: {
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1279px'},
        'desktop': {'min': '1280px'},
      },
    },
  },
  plugins: [],
};
export default config; 