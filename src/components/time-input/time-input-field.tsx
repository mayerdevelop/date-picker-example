import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  Ref,
} from 'react';
import { forwardRef, useRef, useState } from 'react';

import useMergeRef from '@/components/hooks/use-merge-ref';
import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

import { clamp, createTimeHandler, padTime } from './utils';

interface TimeInputFieldProps extends CommonProps {
  disabled?: boolean;
  id?: string;
  name?: string;
  max?: number;
  min?: number;
  onChange: ReturnType<typeof createTimeHandler>;
  onFocus?: (event: FocusEvent<HTMLInputElement, Element>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void;
  placeholder?: string;
  setValue: (value: string) => void;
  withSeparator?: boolean;
  value: string | number | readonly string[];
}

const TimeInputField = forwardRef<HTMLInputElement, TimeInputFieldProps>(
  (props, ref) => {
    const {
      className,
      onFocus,
      onBlur,
      onChange,
      setValue,
      withSeparator = false,
      max,
      min = 0,
      value,
      ...rest
    } = props;

    const [digitsEntered, setDigitsEntered] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      if (typeof onFocus === 'function') {
        onFocus(event);
      }
      inputRef?.current?.select();
      setDigitsEntered(0);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
      if (typeof onBlur === 'function') {
        onBlur(event);
      }
      if (digitsEntered === 1) {
        if (typeof onChange === 'function') {
          onChange(event.currentTarget.value, false);
        }
      }
    };

    const handleClick = (event: MouseEvent<HTMLInputElement>) => {
      event.stopPropagation();
      inputRef?.current?.select();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const padded = padTime(
          clamp(
            parseInt(event.currentTarget.value, 10) + 1,
            min,
            max as number
          ).toString()
        );

        if (value !== padded) {
          onChange(padded, false);
        }
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const padded = padTime(
          clamp(
            parseInt(event.currentTarget.value, 10) - 1,
            min,
            max as number
          ).toString()
        );

        if (value !== padded) {
          onChange(padded, false);
        }
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setDigitsEntered(digitsEntered + 1);

      const _val = parseInt(event.currentTarget.value, 10).toString();

      if (_val === '0' && digitsEntered === 0) {
        setValue('00');

        return;
      }
      onChange(_val, true, digitsEntered > 0);
    };

    return (
      <>
        <input
          ref={useMergeRef(inputRef as Ref<HTMLInputElement>, ref)}
          className={cn('time-input-field', className)}
          inputMode="numeric"
          type="text"
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
          onClick={handleClick}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {withSeparator && <span> : </span>}
      </>
    );
  }
);

TimeInputField.displayName = 'TimeInputField';

export default TimeInputField;
