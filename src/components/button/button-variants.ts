import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'group flex h-fit flex-row flex-nowrap items-center justify-center gap-2 rounded font-semibold transition-all disabled:cursor-default disabled:border-none disabled:bg-gs1-disabled-100 disabled:text-gs1-disabled-500',
  {
    variants: {
      variant: {
        outlined: 'border',
        solid: 'border-none',
        ghost: 'border-none text-gs1-info-500',
      },
      color: {
        blue: '',
        danger: '',
        success: '',
        warning: '',
        sky: '',
        grass: '',
        purple: '',
        default: '',
      },
      size: {
        xs: 'px-4 py-1.5 text-sm',
        sm: 'px-4 py-2.5 text-sm',
        md: 'px-5 py-3 text-gs1-base',
        none: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'solid',
      color: 'default',
      size: 'md',
    },
    compoundVariants: [
      // Solid Variants
      {
        variant: 'solid',
        color: 'blue',
        class: 'bg-gs1-blue-300 text-white hover:bg-gs1-blue-500',
      },
      {
        variant: 'solid',
        color: 'danger',
        class: 'bg-gs1-danger-500 text-white hover:bg-red-700',
      },
      {
        variant: 'solid',
        color: 'success',
        class: 'bg-gs1-grass-300 text-white hover:bg-green-600',
      },
      {
        variant: 'solid',
        color: 'warning',
        class: 'bg-yellow-500 text-white hover:bg-yellow-600',
      },
      {
        variant: 'solid',
        color: 'sky',
        class: 'bg-gs1-sky-300 text-white hover:bg-gs1-sky-500',
      },
      {
        variant: 'solid',
        color: 'grass',
        class: 'bg-gs1-grass-300 text-white hover:bg-gs1-grass-500',
      },
      {
        variant: 'solid',
        color: 'purple',
        class: 'bg-gs1-purple-300 text-white hover:bg-gs1-purple-500',
      },
      {
        variant: 'solid',
        color: 'default',
        class: 'bg-gs1-orange-300 text-white hover:bg-gs1-orange-500',
      },
      // Outlined Variants
      {
        variant: 'outlined',
        color: 'blue',
        class: 'border-gs1-blue-300 text-gs1-blue-300 hover:bg-gs1-blue-300/20',
      },
      {
        variant: 'outlined',
        color: 'danger',
        class: 'border-red-500 text-red-500 hover:bg-red-500/20',
      },
      {
        variant: 'outlined',
        color: 'success',
        class: 'border-green-500 text-green-500 hover:bg-green-500/20',
      },
      {
        variant: 'outlined',
        color: 'warning',
        class: 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/20',
      },
      {
        variant: 'outlined',
        color: 'sky',
        class: 'border-gs1-sky-300 text-gs1-sky-300 hover:bg-gs1-sky-300/20',
      },
      {
        variant: 'outlined',
        color: 'grass',
        class:
          'border-gs1-grass-300 text-gs1-grass-300 hover:bg-gs1-grass-300/20',
      },
      {
        variant: 'outlined',
        color: 'purple',
        class:
          'border-gs1-purple-300 text-gs1-purple-300 hover:bg-gs1-purple-300/20',
      },
      {
        variant: 'outlined',
        color: 'default',
        class:
          'border-gs1-orange-300 text-gs1-orange-300 hover:bg-gs1-orange-300/20',
      },
    ],
  }
);
