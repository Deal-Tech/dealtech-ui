/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Skala Tailwind bawaan, tiap ukuran dikurangi 1px (0.0625rem).
      // Tinggi baris dibiarkan seperti bawaan.
      fontSize: {
        xs: ['0.6875rem', { lineHeight: '1rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.0625rem', { lineHeight: '1.75rem' }],
        xl: ['1.1875rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.4375rem', { lineHeight: '2rem' }],
        '3xl': ['1.8125rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.1875rem', { lineHeight: '2.5rem' }],
        '5xl': ['2.9375rem', { lineHeight: '1' }],
        '6xl': ['3.6875rem', { lineHeight: '1' }],
        '7xl': ['4.4375rem', { lineHeight: '1' }],
        '8xl': ['5.9375rem', { lineHeight: '1' }],
        '9xl': ['7.9375rem', { lineHeight: '1' }],
      },
      fontFamily: {
        sans: ['Inter', '"SN Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        app: {
          bg: 'var(--app-bg)',
          surface: 'var(--app-surface)',
          elevated: 'var(--app-elevated)',
          text: 'var(--app-text)',
          body: 'var(--app-body-text)',
          muted: 'var(--app-text-muted)',
          faint: 'var(--app-text-faint)',
          border: 'var(--app-border)',
          'border-strong': 'var(--app-border-strong)',
          fill: 'var(--app-fill)',
          'fill-strong': 'var(--app-fill-strong)',
          primary: 'var(--app-primary)',
          'primary-hover': 'var(--app-primary-hover)',
          'primary-deep': 'var(--app-primary-deep)',
          'primary-tint': 'var(--app-primary-tint)',
          'on-primary': 'var(--app-on-primary)',
          neutral: 'var(--app-neutral)',
          success: 'var(--app-success)',
          warning: 'var(--app-warning)',
          danger: 'var(--app-danger)',
        },
      },
    },
  },
  plugins: [],
};
