import type { Config } from 'tailwindcss'
import sharedConfig from '@copronomie/config/tailwind.config.js'

const config: Config = {
  ...sharedConfig,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme?.extend,
      colors: {
        ...sharedConfig.theme?.extend?.colors,
        landing: {
          primary: '#000000',
          secondary: '#64748B',
          light: 'rgb(247, 246, 247)',
          border: 'rgba(0, 0, 0, 0.1)',
          'overlay-light': 'rgba(255, 255, 255, 0.1)',
          'overlay-strong': 'rgba(255, 255, 255, 0.25)',
        }
      },
      backdropBlur: {
        xs: '2px',
        md: '6px',
        lg: '12px',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-fragment-mono)', 'monospace'],
        heading: ['var(--font-general-sans)', 'var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'hero': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'lead': ['1.25rem', { lineHeight: '1.6', fontWeight: '400' }],
      },
      borderRadius: {
        ...sharedConfig.theme?.extend?.borderRadius,
        pill: '99px',
      },
      boxShadow: {
        glass: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
        card: '0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-lift': '0 8px 24px rgba(0, 0, 0, 0.1)',
      }
    }
  }
}

export default config