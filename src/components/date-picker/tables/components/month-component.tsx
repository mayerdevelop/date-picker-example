/* eslint-disable @typescript-eslint/no-explicit-any */
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { CSSProperties, forwardRef, useMemo } from 'react';

import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

import { getMonthDays } from '../../utils/get-month-days';
import { getWeekdaysNames } from '../../utils/get-weekdays-names';
import { isSameDate } from '../../utils/is-same-date';
import Day from './day-component';
import getDayProps, { GetDayPropsReturn } from './props/get-day-props';
import type { DayKeydownPayload, Modifiers } from './types';

import dayjs from 'dayjs';

export interface MonthBaseProps {
  month?: Date;
  value?: Date | Date[];
  dayClassName?: (date: Date, modifiers: Modifiers) => string;
  dayStyle?: (date: Date, modifiers: Modifiers) => CSSProperties;
  disableDate?: (date: Date) => boolean;
  disableOutOfMonth?: boolean;
  minDate?: Date;
  maxDate?: Date;
  hideWeekdays?: boolean;
  fullWidth?: boolean;
  preventFocus?: boolean;
  focusable?: boolean;
  firstDayOfWeek?: any;
  hideOutOfMonthDates?: boolean;
  weekendDays?: [number, number];
  isDateInRange?:
    | (() => boolean)
    | ((date: Date, props: GetDayPropsReturn) => boolean);
  isDateFirstInRange?:
    | (() => boolean)
    | ((date: Date, props: GetDayPropsReturn) => boolean);
  isDateLastInRange?:
    | (() => boolean)
    | ((date: Date, props: GetDayPropsReturn) => boolean);
}

export interface MonthProps extends CommonProps, MonthBaseProps {
  onChange?: (value: Date) => void;
  locale?: string;
  onDayMouseEnter?: (date: Date, event: MouseEvent<HTMLButtonElement>) => void;
  range?: [Date, Date];
  onDayKeyDown?: (
    payload: DayKeydownPayload,
    event: KeyboardEvent<HTMLButtonElement>
  ) => void;
  daysRefs: HTMLButtonElement[][];
  renderDay?: (date: Date) => ReactNode;
  weekdayLabelFormat?: string;
}

const noop = () => false;

const Month = forwardRef<HTMLTableElement, MonthProps>((props, ref) => {
  const {
    className,
    month,
    value,
    onChange,
    disableOutOfMonth = false,
    locale,
    dayClassName,
    dayStyle,
    minDate,
    maxDate,
    disableDate,
    onDayMouseEnter,
    range,
    hideWeekdays = false,
    fullWidth = false,
    preventFocus = false,
    focusable = true,
    firstDayOfWeek = 'monday',
    onDayKeyDown,
    daysRefs,
    hideOutOfMonthDates = false,
    isDateInRange = noop,
    isDateFirstInRange = noop,
    isDateLastInRange = noop,
    renderDay,
    weekdayLabelFormat,
    weekendDays = [0, 6],
    ...rest
  } = props;

  const finalLocale = locale || '';
  const days = getMonthDays(month as Date, firstDayOfWeek);

  const weekdays = getWeekdaysNames(
    finalLocale,
    firstDayOfWeek,
    weekdayLabelFormat
  ).map((weekday: any) => (
    <th key={weekday} className="week-day-cell">
      <span className="week-day-cell-content">{weekday}</span>
    </th>
  ));

  const hasValue = Array.isArray(value)
    ? value.every((item) => item instanceof Date)
    : value instanceof Date;

  const hasValueInMonthRange =
    value instanceof Date &&
    dayjs(value).isAfter(dayjs(month).startOf('month')) &&
    dayjs(value).isBefore(dayjs(month).endOf('month'));

  const getDayPropsParams = {
    month: month as Date,
    hasValue,
    minDate: minDate as Date,
    maxDate: maxDate as Date,
    value: value as Date,
    disableDate: disableDate as (date: Date) => boolean,
    disableOutOfMonth: disableOutOfMonth as boolean,
    range: range as [Date, Date],
    weekendDays,
  };

  const firstIncludedDay = useMemo(
    () =>
      days
        .flatMap((_: any) => _)
        .find((date: any) => {
          const dayProps = getDayProps({
            ...getDayPropsParams,
            ...{ date },
          });

          return !dayProps.disabled && !dayProps.outOfMonth;
        }) || dayjs(month).startOf('month').toDate(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const rows = days.map((row: any, rowIndex: number) => {
    const cells = row.map((date: any, cellIndex: number) => {
      const dayProps = getDayProps({ ...getDayPropsParams, ...{ date } });

      const onKeyDownPayload = { rowIndex, cellIndex, date };

      return (
        <td key={cellIndex} className={cn('date-picker-cell')}>
          <Day
            ref={(button) => {
              if (daysRefs) {
                if (!Array.isArray(daysRefs[rowIndex])) {
                  daysRefs[rowIndex] = [];
                }

                daysRefs[rowIndex][cellIndex] = button as HTMLButtonElement;
              }
            }}
            className={
              typeof dayClassName === 'function'
                ? dayClassName(date, dayProps)
                : ''
            }
            disabled={dayProps.disabled}
            firstInMonth={isSameDate(date, firstIncludedDay)}
            firstInRange={
              dayProps.firstInRange || isDateFirstInRange(date, dayProps)
            }
            focusable={focusable}
            fullWidth={fullWidth}
            hasValue={hasValueInMonthRange}
            hideOutOfMonthDates={hideOutOfMonthDates}
            inRange={dayProps.inRange || isDateInRange(date, dayProps)}
            isToday={isSameDate(date, new Date())}
            lastInRange={
              dayProps.lastInRange || isDateLastInRange(date, dayProps)
            }
            outOfMonth={dayProps.outOfMonth}
            renderDay={renderDay}
            selected={dayProps.selected || dayProps.selectedInRange}
            style={
              typeof dayStyle === 'function' ? dayStyle(date, dayProps) : {}
            }
            value={date}
            weekend={dayProps.weekend}
            onClick={() => typeof onChange === 'function' && onChange(date)}
            onKeyDown={(event) =>
              typeof onDayKeyDown === 'function' &&
              onDayKeyDown(onKeyDownPayload, event)
            }
            onMouseDown={(event) => preventFocus && event.preventDefault()}
            onMouseEnter={
              typeof onDayMouseEnter === 'function' ? onDayMouseEnter : noop
            }
          />
        </td>
      );
    });

    return (
      <tr key={rowIndex} className={cn('date-picker-week-cell')}>
        {cells}
      </tr>
    );
  });

  return (
    <table
      ref={ref}
      cellSpacing="0"
      className={cn('picker-table', className)}
      {...rest}
    >
      {!hideWeekdays && (
        <thead>
          <tr>{weekdays}</tr>
        </thead>
      )}
      <tbody>{rows}</tbody>
    </table>
  );
});

Month.displayName = 'Month';

export default Month;
