/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Lime Green
        primary: '#506600',
        'primary-container': '#ccff00',
        'primary-fixed': '#c3f400',
        'primary-fixed-dim': '#abd600',
        'on-primary': '#ffffff',
        'on-primary-container': '#161e00',
        'on-primary-fixed': '#161e00',
        'on-primary-fixed-variant': '#3c4d00',
        
        // Secondary - Purple
        secondary: '#625595',
        'secondary-container': '#c6b7ff',
        'secondary-fixed': '#e7deff',
        'secondary-fixed-dim': '#ccbeff',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#524584',
        'on-secondary-fixed': '#1e0e4e',
        'on-secondary-fixed-variant': '#4a3d7c',
        
        // Tertiary
        tertiary: '#5f5e5e',
        'tertiary-container': '#efeceb',
        'tertiary-fixed': '#e5e2e1',
        'tertiary-fixed-dim': '#c8c6c5',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#6c6a6a',
        
        // Error
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        
        // Surface tokens (Material Design 3)
        surface: '#fbf9f4',
        'surface-bright': '#fbf9f4',
        'surface-dim': '#dcdad5',
        'surface-container': '#f0eee9',
        'surface-container-low': '#f5f3ee',
        'surface-container-high': '#eae8e3',
        'surface-container-highest': '#e4e2dd',
        'surface-tint': '#506600',
        'surface-variant': '#e4e2dd',
        
        // On surface
        'on-surface': '#1b1c19',
        'on-surface-variant': '#444933',
        
        // Background
        background: '#fbf9f4',
        'on-background': '#1b1c19',
        
        // Outline
        outline: '#747a60',
        'outline-variant': '#c4c9ac',
        
        // Inverse
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f3f1ec',
        'inverse-primary': '#abd600',
        
        // Custom semantic aliases
        lima: '#ccff00',
        lavanda: '#c6b7ff',
      },
      fontFamily: {
        'display-lg': ['Hanken Grotesk', 'sans-serif'],
        'headline-lg': ['Hanken Grotesk', 'sans-serif'],
        'headline-lg-mobile': ['Hanken Grotesk', 'sans-serif'],
        'body-lg': ['Hanken Grotesk', 'sans-serif'],
        'body-md': ['Hanken Grotesk', 'sans-serif'],
        'label-md': ['Hanken Grotesk', 'sans-serif'],
        'accent-handwritten': ['Bricolage Grotesque', 'sans-serif'],
      },
      spacing: {
        'unit': '4px',
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'gutter': '16px',
        'margin-mobile': '20px',
        'margin-desktop': '64px',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
    },
  },
  plugins: [],
}