/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

import { formatYear } from '../utils/format-year';
import { getDecadeRange } from '../utils/get-decade-range';
import Header from './header-table';

export interface YearTableProps extends CommonProps {
  value: number;
  onChange: (value: number) => void;
  minYear?: number;
  maxYear?: number;
  yearLabelFormat?: string;
  preventFocus?: boolean;
}

const YearTable = (props: YearTableProps) => {
  const {
    className,
    value,
    onChange,
    minYear,
    maxYear,
    preventFocus,
    yearLabelFormat = 'YYYY',
    ...rest
  } = props;

  const [decade, setDecade] = useState(value);
  const range = getDecadeRange(decade);

  const years = range.map((year: any) => {
    const disabled = year < (minYear as number) || year > (maxYear as number);

    const active = year === value;

    return (
      <button
        key={year}
        className={cn(
          'year-picker-cell',
          active && !disabled
            ? 'year-picker-cell-active bg-gs1-blue-300'
            : 'text-gray-800',
          !active && !disabled && 'hover:bg-gray-100',
          disabled && 'year-picker-cell-disabled'
        )}
        disabled={disabled}
        type="button"
        onClick={() => onChange(year)}
        onMouseDown={(event) => preventFocus && event.preventDefault()}
      >
        {formatYear(year, yearLabelFormat)}
      </button>
    );
  });

  return (
    <div className={cn('year-picker', className)} {...rest}>
      <Header
        nextLevelDisabled
        hasNext={
          typeof maxYear === 'number' ? maxYear > range[range.length - 1] : true
        }
        hasPrevious={typeof minYear === 'number' ? minYear < range[0] : true}
        label={`${formatYear(range[0], yearLabelFormat)} - ${formatYear(
          range[range.length - 1],
          yearLabelFormat
        )}`}
        nextLabel={'Next decade'}
        preventFocus={preventFocus}
        previousLabel={'Previous decade'}
        onNext={() => setDecade((current) => current + 10)}
        onPrevious={() => setDecade((current) => current - 10)}
      />
      <div className="year-table">{years}</div>
    </div>
  );
};

export default YearTable;
