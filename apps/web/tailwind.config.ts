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
          primary: 'rgb(27, 12, 37)',
          light: 'rgb(247, 246, 247)',
          border: 'rgba(255, 255, 255, 0.25)',
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
      borderRadius: {
        ...sharedConfig.theme?.extend?.borderRadius,
        pill: '99px',
      },
      boxShadow: {
        glass: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.3), 0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
        card: '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
      }
    }
  }
}

export default config