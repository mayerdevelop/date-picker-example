import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { forwardRef } from 'react';

import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

export interface DayProps
  extends CommonProps,
    Omit<ComponentPropsWithRef<'button'>, 'value' | 'onMouseEnter'> {
  value: Date;
  selected: boolean;
  weekend: boolean;
  outOfMonth: boolean;
  onMouseEnter: (date: Date, event: MouseEvent<HTMLButtonElement>) => void;
  hasValue: boolean;
  inRange: boolean;
  firstInRange: boolean;
  lastInRange: boolean;
  isToday: boolean;
  fullWidth: boolean;
  firstInMonth: boolean;
  focusable: boolean;
  hideOutOfMonthDates?: boolean;
  renderDay?: (date: Date) => ReactNode;
  disabled: boolean;
}

function getDayTabIndex({
  focusable,
  hasValue,
  selected,
  firstInMonth,
}: {
  focusable: boolean;
  hasValue: boolean;
  selected: boolean;
  firstInMonth: boolean;
}) {
  if (!focusable) {
    return -1;
  }

  if (hasValue) {
    return selected ? 0 : -1;
  }

  return firstInMonth ? 0 : -1;
}

const Day = forwardRef<HTMLButtonElement, DayProps>((props, ref) => {
  const {
    className,
    value,
    selected,
    weekend,
    outOfMonth,
    onMouseEnter,
    hasValue,
    firstInRange,
    lastInRange,
    inRange,
    isToday,
    firstInMonth,
    focusable,
    hideOutOfMonthDates,
    renderDay,
    disabled,
    fullWidth,
    ...others
  } = props;

  return (
    <button
      {...others}
      ref={ref}
      className={cn(
        'date-picker-cell-content',
        disabled && 'date-picker-cell-disabled',
        isToday && `ring-1 ring-inset ring-bg-gs1-blue-300`,
        weekend && !disabled && 'date-picker-cell-weekend',
        outOfMonth && !disabled && 'date-picker-other-month',
        outOfMonth && hideOutOfMonthDates && 'd-none',
        !outOfMonth &&
          !disabled &&
          !selected &&
          'date-picker-cell-current-month',
        !disabled && !selected && !inRange && 'date-picker-cell-hoverable',
        selected &&
          !disabled &&
          'date-picker-cell-selected bg-gs1-blue-300 text-neutral',
        inRange &&
          !disabled &&
          !firstInRange &&
          !lastInRange &&
          !selected &&
          'bg-gs1-blue-300',
        !inRange && !firstInRange && !lastInRange && 'rounded-md',
        inRange && isToday && 'date-picker-cell-inrange-today',
        firstInRange && !disabled && 'date-picker-cell-selected-start',
        lastInRange && !disabled && 'date-picker-cell-selected-end',
        className
      )}
      disabled={disabled}
      tabIndex={getDayTabIndex({
        focusable,
        hasValue,
        selected,
        firstInMonth,
      })}
      type="button"
      onMouseEnter={(event) => onMouseEnter(value, event)}
    >
      {typeof renderDay === 'function' ? renderDay(value) : value?.getDate()}
    </button>
  );
});

Day.displayName = 'Day';

export default Day;
