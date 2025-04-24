import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  Ref,
} from 'react';
import { forwardRef, useRef } from 'react';

import useMergeRef from '@/components/hooks/use-merge-ref';
import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

interface AmPmInputProps extends CommonProps {
  disabled?: boolean;
  amLabel?: string;
  onChange: (value: string, triggerShift: boolean) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  pmLabel?: string;
  value: string | number | readonly string[];
}

const AmPmInput = forwardRef<HTMLInputElement, AmPmInputProps>((props, ref) => {
  const { className, onChange, onFocus, value, amLabel, pmLabel, ...rest } =
    props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
    inputRef?.current?.select();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      onChange(
        value === amLabel ? (pmLabel as string) : (amLabel as string),
        true
      );
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
    inputRef?.current?.select();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const lastInputVal = event.target.value.slice(-1).toLowerCase();

    if (lastInputVal === 'p') {
      event.preventDefault();
      onChange(pmLabel as string, true);

      return;
    }

    if (lastInputVal === 'a') {
      event.preventDefault();
      onChange(amLabel as string, true);

      return;
    }

    onChange(value.toString(), true);
  };

  return (
    <input
      ref={useMergeRef(inputRef as Ref<HTMLInputElement>, ref)}
      className={cn('time-input-field', 'am-pm-input', className)}
      type="text"
      value={value}
      onChange={handleChange}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
});

AmPmInput.displayName = 'AmPmInput';

export default AmPmInput;
