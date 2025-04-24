import { CSSProperties, ReactNode } from 'react';

export interface CommonProps {
  id?: string;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export type ControlSize = 'lg' | 'md' | 'sm';
export type FormLayout = 'horizontal' | 'vertical' | 'inline';