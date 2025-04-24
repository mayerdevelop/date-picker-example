import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        gotham: 'var(--font-gotham)',
      },
      fontSize: {
        smp: ['0.9375rem', '140%'],
        title: ['2rem', '118.75%'],
        subtitle: ['1.5rem', '141.667%'],
        'gs1-base': ['0.9375rem', '140%'],
        'gs1-subtitle-lg': ['1.125rem', '1.5rem'],
        'gs1-subtitle-md': ['0.9375rem', '2.125rem'],
        'gs1-title-lg': ['2.5rem', '120%'],
        'gs1-title-md': ['2rem', '2.375rem'],
        'gs1-title-sm': ['1.125rem', '1.5625rem'],
      },
      lineHeight: {
        'gs1-base': '1.4',
        'gs1-subtitle-md': '2.125rem',
        'gs1-description-md': '1.5rem',
        'gs1-description-sm': '1.3125rem',
      },
      colors: {
        gs1: {
          success: {
            100: '#CCF1DC',
            500: '#026B30',
          },
          warn: {
            100: '#FFE6CC',
            200: '#FF8200',
            500: '#A15700',
          },
          info: {
            100: '#F0F5FA',
            200: '#E5F0FC',
            300: '#C4D7ED',
            500: '#002C6C',
          },
          danger: {
            100: '#FFDFDF',
            500: '#BA1B23',
            700: '#90151A',
            900: '#750E13',
          },
          muted: {
            100: '#E5E8EB',
            200: '#A6B0BB',
            400: '#696D73',
            500: '#414345',
          },
          disabled: {
            100: '#E5E8EB',
            500: '#A6B0BB',
          },
          purple: {
            300: '#A2539A',
            500: '#823D80',
            700: '#6F346D',
          },
          grass: {
            300: '#417E12',
            500: '#376911',
            700: '#2C530E',
          },
          sky: {
            300: '#007B93',
            500: '#095A6B',
            700: '#074755',
          },
          blue: {
            300: '#002C6C',
            500: '#001A4D',
            700: '#001335',
          },
          orange: {
            300: '#CD3C0D',
            400: '#d5613b',
            500: '#A82C05',
            700: '#912305',
          },
          gray: {
            100: '#e2e6e9',
            300: '#696D73',
            400: '#4b4d4f',
          },
          'dark-gray': {
            500: '#262626',
          },
          'eletric-lemon': {
            100: '#BFD730 ',
          },
          link: '#008DBD',
          badge: {
            100: '#F05587',
            200: '#00B6DE',
          },
        },
        error: '#DC2626',
      }
    }
  },
} satisfies Config;
