'use client';

import React, { MouseEvent, ReactNode } from 'react';

import { buttonVariants } from '@/components/button/button-variants';
import { cn } from '@/utils/cn';

import { type VariantProps } from 'class-variance-authority';
import { BsArrowRight } from 'react-icons/bs';

export type ButtonProps = {
  children?: ReactNode;
  showArrow?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
} & VariantProps<typeof buttonVariants>;

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  showArrow = false,
  onClick,
  variant,
  color,
  size,
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, color, size }), className)}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {children}
      {showArrow && (
        <BsArrowRight
          className="transition-all group-hover:translate-x-1"
          height={16}
          width={16}
        />
      )}
    </button>
  );
};

export default Button;
