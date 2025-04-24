import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { forwardRef, useRef, useState } from 'react';

import useControllableState from '@/components/hooks/use-controllable-state';
import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

import { MonthBaseProps } from './tables/components/month-component';
import { DayKeydownPayload } from './tables/components/types';
import DateTable from './tables/data-table';
import MonthTable from './tables/month-table';
import YearTable from './tables/year-table';

export interface CalendarSharedProps extends Omit<MonthBaseProps, 'value'> {
  dateViewCount?: number;
  defaultView?: 'date' | 'month' | 'year';
  defaultMonth?: Date;
  enableHeaderLabel?: boolean;
  locale?: string;
  labelFormat?: { month: string; year: string };
  monthLabelFormat?: string;
  onDayMouseEnter?: (date: Date, event: MouseEvent) => void;
  onMonthChange?: (month: Date) => void;
  paginateBy?: number;
  range?: [Date, Date];
  renderDay?: (date: Date) => ReactNode;
  weekdayLabelFormat?: string;
  yearLabelFormat?: string;
}

interface CalendarBaseProps extends CommonProps, CalendarSharedProps {
  onChange?: (value: Date | Date[]) => void;
  value?: Date | Date[] | null;
}

const CalendarBase = forwardRef<HTMLDivElement, CalendarBaseProps>(
  (props, ref) => {
    const {
      className,
      dateViewCount = 1,
      dayClassName,
      dayStyle,
      defaultMonth,
      defaultView = 'date',
      disableDate,
      disableOutOfMonth,
      enableHeaderLabel = true,
      firstDayOfWeek = 'monday',
      hideOutOfMonthDates,
      hideWeekdays,
      isDateFirstInRange,
      isDateInRange,
      isDateLastInRange,
      labelFormat = {
        month: 'MMM',
        year: 'YYYY',
      },
      locale,
      maxDate,
      minDate,
      month,
      monthLabelFormat = 'MMM',
      onChange,
      onDayMouseEnter,
      onMonthChange,
      paginateBy = dateViewCount,
      preventFocus,
      range,
      renderDay,
      style,
      value,
      weekdayLabelFormat = 'ddd',
      weekendDays,
      yearLabelFormat = 'YYYY',
      ...rest
    } = props;

    const [selectionState, setSelectionState] = useState(defaultView);

    const finalLocale = locale || '';

    const daysRefs = useRef<HTMLButtonElement[][][]>(
      Array(dateViewCount)
        .fill(0)
        .map(() => [])
    );

    const [_month, setMonth] = useControllableState({
      prop: month,
      defaultProp: defaultMonth !== undefined ? defaultMonth : new Date(),
      onChange: onMonthChange,
    });

    const [yearSelection, setYearSelection] = useState(_month?.getFullYear());
    const [monthSelection, setMonthSelection] = useState(_month?.getMonth());

    const minYear = minDate instanceof Date ? minDate.getFullYear() : 100;
    const maxYear = maxDate instanceof Date ? maxDate.getFullYear() : 10000;

    const daysPerRow = 6;

    const focusOnNextFocusableDay = (
      direction: 'down' | 'up' | 'left' | 'right',
      monthIndex: number,
      payload: DayKeydownPayload,
      n = 1
    ) => {
      const changeRow = ['down', 'up'].includes(direction);

      const rowIndex = changeRow
        ? payload.rowIndex + (direction === 'down' ? n : -n)
        : payload.rowIndex;

      const cellIndex = changeRow
        ? payload.cellIndex
        : payload.cellIndex + (direction === 'right' ? n : -n);

      const dayToFocus = daysRefs.current[monthIndex][rowIndex][cellIndex];

      if (!dayToFocus) {
        return;
      }

      if (dayToFocus.disabled) {
        focusOnNextFocusableDay(direction, monthIndex, payload, n + 1);
      } else {
        dayToFocus.focus();
      }
    };

    const handleDayKeyDown = (
      monthIndex: number,
      payload: DayKeydownPayload,
      event: KeyboardEvent<HTMLButtonElement>
    ) => {
      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();

          const hasRowBelow =
            payload.rowIndex + 1 < daysRefs.current[monthIndex].length;

          if (hasRowBelow) {
            focusOnNextFocusableDay('down', monthIndex, payload);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();

          const hasRowAbove = payload.rowIndex > 0;

          if (hasRowAbove) {
            focusOnNextFocusableDay('up', monthIndex, payload);
          }
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();

          const isNotLastCell = payload.cellIndex !== daysPerRow;

          if (isNotLastCell) {
            focusOnNextFocusableDay('right', monthIndex, payload);
          } else if (monthIndex + 1 < dateViewCount) {
            if (daysRefs.current[monthIndex + 1][payload.rowIndex]) {
              daysRefs.current[monthIndex + 1][payload.rowIndex][0]?.focus();
            }
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();

          if (payload.cellIndex !== 0) {
            focusOnNextFocusableDay('left', monthIndex, payload);
          } else if (monthIndex > 0) {
            if (daysRefs.current[monthIndex - 1][payload.rowIndex]) {
              daysRefs.current[monthIndex - 1][payload.rowIndex][
                daysPerRow
              ].focus();
            }
          }
          break;
        }
        default:
          break;
      }
    };

    return (
      <div ref={ref} className={cn('picker-view', className)} {...rest}>
        {selectionState === 'year' && (
          <YearTable
            className={className}
            maxYear={maxYear}
            minYear={minYear}
            preventFocus={preventFocus}
            value={yearSelection as number}
            yearLabelFormat={yearLabelFormat}
            onChange={(year) => {
              setMonth(new Date(year, monthSelection as number, 1));
              setYearSelection(year);
              setSelectionState('date');
            }}
          />
        )}
        {selectionState === 'month' && (
          <MonthTable
            className={className}
            locale={finalLocale}
            maxDate={maxDate}
            minDate={minDate}
            monthLabelFormat={monthLabelFormat}
            preventFocus={preventFocus}
            style={style}
            value={{
              month: (_month as Date).getMonth(),
              year: (_month as Date).getFullYear(),
            }}
            year={yearSelection as number}
            yearLabelFormat={yearLabelFormat}
            onChange={(monthValue) => {
              // Cria uma nova data com o primeiro dia do mês selecionado
              const firstDayOfMonth = new Date(
                yearSelection as number,
                monthValue,
                1
              );

              // Atualiza o mês exibido no calendário
              setMonth(firstDayOfMonth);

              // Define o valor do calendário como o primeiro dia do mês
              if (onChange) {
                onChange(firstDayOfMonth);
              }

              // Fecha a visualização de meses e retorna para a visualização de dias
              if (defaultView !== 'month') {
                setSelectionState('date');
              }
            }}
            onNextLevel={() => setSelectionState('year')}
            onYearChange={setYearSelection}
          />
        )}
        {selectionState === 'date' && (
          <DateTable
            dateViewCount={dateViewCount}
            dayClassName={dayClassName}
            dayStyle={dayStyle}
            daysRefs={daysRefs}
            disableDate={disableDate}
            disableOutOfMonth={disableOutOfMonth}
            enableHeaderLabel={enableHeaderLabel}
            firstDayOfWeek={firstDayOfWeek}
            hideOutOfMonthDates={hideOutOfMonthDates}
            hideWeekdays={hideWeekdays}
            isDateFirstInRange={isDateFirstInRange}
            isDateInRange={isDateInRange}
            isDateLastInRange={isDateLastInRange}
            labelFormat={labelFormat}
            locale={finalLocale}
            maxDate={maxDate}
            minDate={minDate}
            month={_month as Date}
            paginateBy={paginateBy}
            preventFocus={preventFocus}
            range={range}
            renderDay={renderDay}
            style={style}
            value={value as Date | Date[]}
            weekdayLabelFormat={weekdayLabelFormat}
            weekendDays={weekendDays}
            onChange={onChange}
            onDayKeyDown={handleDayKeyDown}
            onDayMouseEnter={onDayMouseEnter}
            onMonthChange={setMonth}
            onNextLevel={(view) => setSelectionState(view)}
          />
        )}
      </div>
    );
  }
);

CalendarBase.displayName = 'CalendarBase';

export default CalendarBase;
