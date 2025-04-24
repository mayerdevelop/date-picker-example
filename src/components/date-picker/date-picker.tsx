import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import useControllableState from '@/components/hooks/use-controllable-state';
import useMergeRef from '@/components/hooks/use-merge-ref';
import { CommonProps } from '@/components/types/common';
import capitalize from '@/utils/capitalize';

import type { CalendarSharedProps } from './base-calendar';
import BasePicker, { BasePickerSharedProps } from './base-picker';
import Calendar from './calendar';

import dayjs from 'dayjs';

const DEFAULT_INPUT_FORMAT = 'YYYY-MM-DD';

export interface DatePickerProps
  extends CommonProps,
    Omit<
      CalendarSharedProps,
      | 'onMonthChange'
      | 'onChange'
      | 'isDateInRange'
      | 'isDateFirstInRange'
      | 'isDateLastInRange'
      | 'month'
    >,
    BasePickerSharedProps {
  closePickerOnChange?: boolean;
  defaultOpen?: boolean;
  defaultValue?: Date | null;
  value?: Date | null;
  inputFormat?: string;
  inputtableBlurClose?: boolean;
  openPickerOnClear?: boolean;
  onChange?: (value: Date | null) => void;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (props, ref) => {
    const {
      className,
      clearable = true,
      clearButton,
      closePickerOnChange = true,
      dateViewCount,
      dayClassName,
      dayStyle,
      defaultMonth,
      defaultOpen = false,
      defaultValue,
      defaultView,
      disabled = false,
      disableDate,
      enableHeaderLabel,
      disableOutOfMonth,
      firstDayOfWeek = 'sunday',
      hideOutOfMonthDates,
      hideWeekdays,
      inputFormat,
      inputPrefix,
      inputSuffix,
      inputtable,
      labelFormat = {
        month: 'MMM',
        year: 'YYYY',
      },
      locale = 'pt-BR',
      maxDate,
      minDate,
      name = 'date',
      onBlur,
      onChange,
      onFocus,
      onDropdownClose,
      onDropdownOpen,
      openPickerOnClear = false,
      renderDay,
      size,
      style,
      type,
      value,
      weekendDays,
      yearLabelFormat,
      ...rest
    } = props;

    const finalLocale = locale || '';

    const dateFormat =
      type === 'date'
        ? DEFAULT_INPUT_FORMAT
        : inputFormat || DEFAULT_INPUT_FORMAT;

    const [dropdownOpened, setDropdownOpened] = useState(defaultOpen);

    const inputRef = useRef<HTMLInputElement>(null);

    const [lastValidValue, setLastValidValue] = useState(defaultValue ?? null);

    const [_value, setValue] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange,
    });

    const [calendarMonth, setCalendarMonth] = useState(
      _value || defaultMonth || new Date()
    );

    const [focused, setFocused] = useState(false);

    const [inputState, setInputState] = useState(
      _value instanceof Date
        ? capitalize(dayjs(_value).locale(finalLocale).format(dateFormat))
        : ''
    );

    const closeDropdown = () => {
      setDropdownOpened(false);
      onDropdownClose?.();
    };

    const openDropdown = () => {
      setDropdownOpened(true);
      onDropdownOpen?.();
    };

    useEffect(() => {
      if (!_value) {
        if (maxDate && dayjs(calendarMonth).isAfter(maxDate)) {
          setCalendarMonth(maxDate);
        }

        if (minDate && dayjs(calendarMonth).isBefore(minDate)) {
          setCalendarMonth(minDate);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minDate, maxDate]);

    useEffect(() => {
      if (value === null && !focused) {
        setInputState('');
      }

      if (value instanceof Date && !focused) {
        setInputState(
          capitalize(dayjs(value).locale(finalLocale).format(dateFormat))
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, focused]);

    const handleValueChange = (date: Date | null) => {
      setValue(date);
      setInputState(
        capitalize(dayjs(date).locale(finalLocale).format(dateFormat))
      );
      if (closePickerOnChange) {
        openDropdown();
      }
      window.setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleClear = () => {
      setValue(null);
      setLastValidValue(null);
      setInputState('');
      if (openPickerOnClear) {
        openDropdown();
      }
      inputRef.current?.focus();
    };

    const parseDate = (date: string) =>
      dayjs(date, dateFormat, finalLocale).toDate();

    const setDateFromInput = () => {
      let date = typeof _value === 'string' ? parseDate(_value) : _value;

      if (maxDate && dayjs(date).isAfter(maxDate)) {
        date = maxDate;
      }

      if (minDate && dayjs(date).isBefore(minDate)) {
        date = minDate;
      }

      if (dayjs(date).isValid()) {
        setValue(date);
        setLastValidValue(date as Date);
        setInputState(
          capitalize(dayjs(date).locale(finalLocale).format(dateFormat))
        );
        setCalendarMonth(date as Date);
      } else {
        setValue(lastValidValue);
      }
    };

    const handleInputBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
      if (typeof onBlur === 'function') {
        onBlur(event);
      }
      setFocused(false);

      if (inputtable) {
        setDateFromInput();
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && inputtable) {
        closeDropdown();
        setDateFromInput();
      }
    };

    const handleInputFocus = (event: FocusEvent<HTMLInputElement, Element>) => {
      if (typeof onFocus === 'function') {
        onFocus(event);
      }
      setFocused(true);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      openDropdown();

      const date = parseDate(event.target.value);

      if (dayjs(date).isValid()) {
        setValue(date);
        setLastValidValue(date);
        setInputState(event.target.value);
        setCalendarMonth(date);
      } else {
        setInputState(event.target.value);
      }
    };

    return (
      <BasePicker
        ref={useMergeRef(ref, inputRef)}
        className={className}
        clearButton={clearButton}
        clearable={type === 'date' ? false : clearable && !!_value && !disabled}
        disabled={disabled}
        dropdownOpened={dropdownOpened as boolean}
        inputLabel={inputState}
        inputPrefix={inputPrefix}
        inputSuffix={inputSuffix}
        inputtable={inputtable}
        name={name}
        setDropdownOpened={setDropdownOpened}
        size={size}
        style={style}
        type={type}
        onBlur={handleInputBlur}
        onChange={handleChange}
        onClear={handleClear}
        onDropdownClose={onDropdownClose}
        onDropdownOpen={onDropdownOpen}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <Calendar
          dateViewCount={dateViewCount}
          dayClassName={dayClassName}
          dayStyle={dayStyle}
          defaultMonth={
            defaultMonth || (_value instanceof Date ? _value : new Date())
          }
          defaultView={defaultView}
          disableDate={disableDate}
          disableOutOfMonth={disableOutOfMonth}
          enableHeaderLabel={enableHeaderLabel}
          firstDayOfWeek={firstDayOfWeek}
          hideOutOfMonthDates={hideOutOfMonthDates}
          hideWeekdays={hideWeekdays}
          labelFormat={labelFormat}
          locale={finalLocale}
          maxDate={maxDate}
          minDate={minDate}
          month={inputtable ? calendarMonth : undefined}
          preventFocus={inputtable}
          renderDay={renderDay}
          value={
            _value instanceof Date ? _value : _value && dayjs(_value).toDate()
          }
          weekendDays={weekendDays}
          yearLabelFormat={yearLabelFormat}
          onChange={handleValueChange}
          onMonthChange={setCalendarMonth}
        />
      </BasePicker>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
