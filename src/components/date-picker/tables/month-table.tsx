/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

import { formatYear } from '../utils/format-year';
import { getMonthsNames } from '../utils/get-months-names';
import { isMonthInRange } from '../utils/is-month-in-range';
import Header from './header-table';

export interface MonthTableProps extends CommonProps {
  value: { year: number; month: number };
  onChange: (value: number) => void;
  locale: string;
  year: number;
  onYearChange: (year: number) => void;
  onNextLevel?: () => void;
  minDate?: Date;
  maxDate?: Date;
  monthLabelFormat?: string;
  yearLabelFormat?: string;
  preventFocus?: boolean;
}

const MonthTable = (props: MonthTableProps) => {
  const {
    className,
    value,
    onChange,
    locale,
    year,
    onYearChange,
    onNextLevel,
    minDate,
    maxDate,
    preventFocus,
    monthLabelFormat = 'MMM',
    yearLabelFormat = 'YYYY',
    ...rest
  } = props;

  const range = getMonthsNames(locale, monthLabelFormat);
  const minYear = minDate instanceof Date ? minDate.getFullYear() : undefined;
  const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : undefined;

  const months = range.map((month: any, index: number) => {
    const disabled = !isMonthInRange({
      date: new Date(year, index),
      minDate,
      maxDate,
    });

    const active = index === value.month && year === value.year;

    return (
      <button
        key={month}
        className={cn(
          'month-picker-cell',
          active && !disabled
            ? 'month-picker-cell-active bg-gs1-blue-300'
            : 'text-gray-800 ',
          !active && !disabled && 'hover:bg-gray-100',
          disabled && 'month-picker-cell-disabled'
        )}
        disabled={disabled}
        type="button"
        onClick={() => onChange(index)}
        onMouseDown={(event) => preventFocus && event.preventDefault()}
      >
        {month}
      </button>
    );
  });

  return (
    <div className={cn('month-picker', className)} {...rest}>
      <Header
        className={className}
        hasNext={typeof maxYear === 'number' ? year < maxYear : true}
        hasPrevious={typeof minYear === 'number' ? year > minYear : true}
        label={formatYear(year, yearLabelFormat)}
        nextLabel={'Next year'}
        preventFocus={preventFocus}
        previousLabel={'Previous year'}
        onNext={() => onYearChange(year + 1)}
        onNextLevel={onNextLevel}
        onPrevious={() => onYearChange(year - 1)}
      />
      <div className="month-table">{months}</div>
    </div>
  );
};

export default MonthTable;
