/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"SN Pro"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Token tema diekspos ke Tailwind agar bisa dipakai lewat utility
      // (mis. `bg-app-surface`, `text-app-muted`). Nilainya dari CSS var di src/styles/theme.css.
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
          // Semantik status — pakai HANYA untuk Alert/Badge status.
          success: 'var(--app-success)',
          warning: 'var(--app-warning)',
          danger: 'var(--app-danger)',
        },
      },
    },
  },
  plugins: [],
};
