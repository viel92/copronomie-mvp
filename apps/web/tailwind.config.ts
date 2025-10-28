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
    screens: {
      // Framer Breakpoints
      'sm': '390px',    // Mobile
      'md': '810px',    // Tablet
      'lg': '1200px',   // Desktop
      'xl': '1440px',   // Large desktop
    },
    extend: {
      ...sharedConfig.theme?.extend,
      colors: {
        ...sharedConfig.theme?.extend?.colors,
        landing: {
          // Couleurs principales Framer
          black: 'rgb(27, 12, 37)',
          white: 'rgb(255, 255, 255)',
          'gray-dark': 'rgb(237, 235, 238)',
          gray: 'rgb(247, 246, 247)',

          // Couleurs lite (backgrounds doux)
          'blue-lite': 'rgb(223, 233, 253)',
          'purple-lite': 'rgb(234, 226, 242)',
          'orange-lite': 'rgb(247, 230, 221)',
          'pink-lite': 'rgb(245, 228, 239)',

          // Couleurs vives (accents)
          blue: 'rgb(128, 170, 253)',
          purple: 'rgb(211, 123, 255)',
          orange: 'rgb(252, 172, 132)',
          pink: 'rgb(255, 130, 225)',

          // Alias pour compatibilité
          primary: 'rgb(27, 12, 37)',
          secondary: 'rgb(128, 170, 253)',
          border: 'rgba(27, 12, 37, 0.1)',
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
        sans: ['General Sans', 'var(--font-inter)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-fragment-mono)', 'monospace'],
        heading: ['General Sans', 'var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        // Framer Typography Scale
        'heading-1': ['76px', { lineHeight: '1em', letterSpacing: '0px', fontWeight: '500' }],
        'heading-1-tablet': ['60px', { lineHeight: '1em', letterSpacing: '0px', fontWeight: '500' }],
        'heading-1-mobile': ['44px', { lineHeight: '1.2em', letterSpacing: '0px', fontWeight: '500' }],

        'heading-2': ['60px', { lineHeight: '1em', fontWeight: '500' }],
        'heading-2-tablet': ['48px', { lineHeight: '1em', fontWeight: '500' }],
        'heading-2-mobile': ['36px', { lineHeight: '1em', fontWeight: '500' }],

        'heading-3': ['44px', { lineHeight: '1.2em', fontWeight: '500' }],
        'heading-3-tablet': ['36px', { lineHeight: '1.2em', fontWeight: '500' }],
        'heading-3-mobile': ['28px', { lineHeight: '1.2em', fontWeight: '500' }],

        'heading-4': ['32px', { lineHeight: '1.2em', fontWeight: '500' }],
        'heading-4-tablet': ['28px', { lineHeight: '1.2em', fontWeight: '500' }],
        'heading-4-mobile': ['24px', { lineHeight: '1.2em', fontWeight: '500' }],

        'subtitle': ['24px', { lineHeight: '1.2em', fontWeight: '500' }],

        'body-18': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-18-m': ['18px', { lineHeight: '28px', fontWeight: '500' }],

        'body-16': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-16-m': ['16px', { lineHeight: '26px', fontWeight: '500' }],

        'body-14': ['14px', { lineHeight: '22px', fontWeight: '400' }],

        'tag': ['14px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '500' }],

        // Legacy aliases (for backward compatibility)
        'display': ['76px', { lineHeight: '1em', letterSpacing: '0px', fontWeight: '500' }],
        'hero': ['60px', { lineHeight: '1em', fontWeight: '500' }],
        'h1': ['44px', { lineHeight: '1.2em', fontWeight: '500' }],
        'h2': ['32px', { lineHeight: '1.2em', fontWeight: '500' }],
        'h3': ['24px', { lineHeight: '1.2em', fontWeight: '500' }],
        'lead': ['18px', { lineHeight: '28px', fontWeight: '400' }],
      },
      spacing: {
        // Framer Spacing Tokens (custom only, extends default Tailwind spacing)
        'section-lg': '160px',
        'section-md': '120px',
        'section-sm': '80px',
        'card-outer-lg': '40px',
        'card-outer-md': '32px',
        'card-outer-sm': '24px',
        'card-inner-lg': '32px',
        'card-inner-md': '24px',
        'card-inner-sm': '16px',
        'el-lg': '32px',
        'el-md': '16px',
        'el-sm': '8px',
      },
      borderRadius: {
        ...sharedConfig.theme?.extend?.borderRadius,
        'pill': '99px',
        'card': '16px',
        'medium': '12px',
        'small': '8px',
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