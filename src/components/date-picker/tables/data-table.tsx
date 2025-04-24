import type { RefObject } from 'react';

import { CommonProps } from '@/components/types/common';
import capitalize from '@/utils/capitalize';
import { cn } from '@/utils/cn';

import { isMonthInRange } from '../utils/is-month-in-range';
import type { MonthBaseProps } from './components/month-component';
import Month from './components/month-component';
import type { DayKeydownPayload } from './components/types';
import Header from './header-table';

import dayjs from 'dayjs';

export interface DateTableProps extends CommonProps, MonthBaseProps {
  dateViewCount: number;
  paginateBy: number;
  locale: string;
  enableHeaderLabel: boolean;
  daysRefs: RefObject<HTMLButtonElement[][][]>;
  onMonthChange: (month: Date) => void;
  onNextLevel: (unit: 'month' | 'year') => void;
  onDayKeyDown: (
    monthIndex: number,
    payload: DayKeydownPayload,
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => void;
  labelFormat?: { month: string; year: string };
  weekdayLabelFormat?: string;
  onChange?: (value: Date) => void;
  onDayMouseEnter?: (date: Date, event: React.MouseEvent) => void;
  preventFocus?: boolean;
  renderDay?: (date: Date) => React.ReactNode;
  range?: [Date, Date];
}

function formatMonthLabel({
  month,
  locale,
  format,
}: {
  month: Date;
  locale: string;
  format: string;
}) {
  return capitalize(dayjs(month).locale(locale).format(format));
}

const DateTable = (props: DateTableProps) => {
  const {
    dateViewCount,
    paginateBy,
    month,
    locale,
    minDate,
    maxDate,
    enableHeaderLabel,
    daysRefs,
    onMonthChange,
    onNextLevel,
    onDayKeyDown,
    className,
    labelFormat,
    weekdayLabelFormat = 'ddd',
    preventFocus,
    renderDay,
    ...rest
  } = props;

  const nextMonth = dayjs(month).add(dateViewCount, 'months').toDate();
  const previousMonth = dayjs(month).subtract(1, 'months').toDate();

  const pickerHeaderLabelClass = 'picker-header-label hover:text-gs1-blue-300';

  const months = Array(dateViewCount)
    .fill(0)
    .map((_, index) => {
      const monthDate = dayjs(month).add(index, 'months').toDate();

      return (
        <div key={index} className="day-picker">
          <Header
            className={className}
            hasNext={
              index + 1 === dateViewCount &&
              isMonthInRange({
                date: nextMonth,
                minDate,
                maxDate,
              })
            }
            hasPrevious={
              index === 0 &&
              isMonthInRange({
                date: previousMonth,
                minDate,
                maxDate,
              })
            }
            onNext={() =>
              onMonthChange(dayjs(month).add(paginateBy, 'months').toDate())
            }
            onPrevious={() =>
              onMonthChange(
                dayjs(month).subtract(paginateBy, 'months').toDate()
              )
            }
          >
            <div>
              <button
                className={cn(pickerHeaderLabelClass)}
                disabled={!enableHeaderLabel}
                tabIndex={index > 0 ? -1 : 0}
                type="button"
                onClick={() => onNextLevel('month')}
                onMouseDown={(event) => preventFocus && event.preventDefault()}
              >
                {formatMonthLabel({
                  month: monthDate,
                  locale,
                  format: labelFormat?.month || 'MMM',
                })}
              </button>
              <button
                className={cn(pickerHeaderLabelClass)}
                disabled={!enableHeaderLabel}
                tabIndex={index > 0 ? -1 : 0}
                type="button"
                onClick={() => onNextLevel('year')}
                onMouseDown={(event) => preventFocus && event.preventDefault()}
              >
                {formatMonthLabel({
                  month: monthDate,
                  locale,
                  format: labelFormat?.year || 'YYYY',
                })}
              </button>
            </div>
          </Header>
          <Month
            className={className}
            daysRefs={(daysRefs.current as HTMLButtonElement[][][])[index]}
            focusable={index === 0}
            locale={locale}
            maxDate={maxDate}
            minDate={minDate}
            month={monthDate}
            preventFocus={preventFocus}
            renderDay={renderDay}
            weekdayLabelFormat={weekdayLabelFormat}
            onDayKeyDown={(...args) => onDayKeyDown(index, ...args)}
            {...rest}
          />
        </div>
      );
    });

  return <>{months}</>;
};

export default DateTable;
