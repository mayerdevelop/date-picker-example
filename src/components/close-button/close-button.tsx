import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import { forwardRef } from 'react';

import type { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

import { BsX } from 'react-icons/bs';

export interface CloseButtonProps
  extends CommonProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  absolute?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  resetDefaultClass?: boolean;
}

const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  (props, ref) => {
    const { absolute, className, resetDefaultClass, ...rest } = props;
    const closeButtonAbsoluteClass = 'absolute z-10';

    const closeButtonClass = cn(
      !resetDefaultClass && 'close-button button-press-feedback',
      absolute && closeButtonAbsoluteClass,
      className
    );

    return (
      <button ref={ref} className={closeButtonClass} type="button" {...rest}>
        <BsX />
      </button>
    );
  }
);

CloseButton.displayName = 'CloseButton';

export default CloseButton;
