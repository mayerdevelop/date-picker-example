import type { ChangeEvent, FocusEvent } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import useControllableState from '@/components/hooks/use-controllable-state';
import useMergeRef from '@/components/hooks/use-merge-ref';
import { CommonProps } from '@/components/types/common';
import capitalize from '@/utils/capitalize';
import { cn } from '@/utils/cn';

import Button from '../button';
import TimeInput from '../time-input';
import { CalendarSharedProps } from './base-calendar';
import BasePicker, { BasePickerSharedProps } from './base-picker';
import Calendar from './calendar';

import dayjs from 'dayjs';

export interface DateTimepickerProps
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
  openPickerOnClear?: boolean;
  onChange?: (value: Date | null) => void;
  amPm?: boolean;
  okButtonContent?: boolean;
}

const DEFAULT_INPUT_FORMAT = 'DD-MMM-YYYY hh:mm a';

const DateTimepicker = forwardRef<HTMLInputElement, DateTimepickerProps>(
  (props, ref) => {
    const {
      className,
      clearable = true,
      closePickerOnChange = false,
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
      firstDayOfWeek = 'monday',
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
      name = 'dateTime',
      okButtonContent = 'OK',
      onBlur,
      onChange,
      onFocus,
      onDropdownClose,
      onDropdownOpen,
      openPickerOnClear,
      renderDay,
      size,
      value,
      weekendDays,
      yearLabelFormat,
      ...rest
    } = props;

    const finalLocale = locale;

    const dateFormat = inputFormat || DEFAULT_INPUT_FORMAT;

    const [dropdownOpened, setDropdownOpened] = useState(defaultOpen);

    const inputRef = useRef<HTMLInputElement>(null);

    const [_, setLastValidValue] = useState(defaultValue ?? null);
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
      if (value === null && !focused) {
        setInputState('');
      }

      if (value instanceof Date && !focused) {
        setInputState(dayjs(value).locale(finalLocale).format(dateFormat));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, focused]);

    const handleValueChange = (date: Date) => {
      if (_value) {
        date.setHours(_value.getHours());
        date.setMinutes(_value.getMinutes());
      } else {
        const now = new Date(Date.now());

        date.setHours(now.getHours());
        date.setMinutes(now.getMinutes());
      }
      setValue(date);
      if (!value && !closePickerOnChange) {
        setInputState(dayjs(date).locale(finalLocale).format(dateFormat));
      }
      if (closePickerOnChange) {
        setInputState(
          capitalize(dayjs(date).locale(finalLocale).format(dateFormat))
        );
        closeDropdown();
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
      onChange?.(null);
    };

    const parseDate = (date: string) =>
      dayjs(date, dateFormat, finalLocale).toDate();

    const handleInputBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
      if (typeof onBlur === 'function') {
        onBlur(event);
      }
      setFocused(false);
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
        if (closePickerOnChange) {
          setInputState(event.target.value);
        }
        setCalendarMonth(date);
      } else {
        if (closePickerOnChange) {
          setInputState(event.target.value);
        }
      }
    };

    const handleTimeChange = (time: Date | null) => {
      if (_value instanceof Date && time instanceof Date) {
        const newDateTime = new Date(
          _value.getFullYear(),
          _value.getMonth(),
          _value.getDate(),
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
          time.getMilliseconds()
        );

        setValue(newDateTime);

        if (!value && !closePickerOnChange) {
          setInputState(
            capitalize(
              dayjs(newDateTime).locale(finalLocale).format(dateFormat)
            )
          );
        }

        if (closePickerOnChange) {
          setInputState(
            capitalize(
              dayjs(newDateTime).locale(finalLocale).format(dateFormat)
            )
          );
        }
      }
      if (closePickerOnChange) {
        closeDropdown();
      }
    };

    const handleOk = () => {
      setInputState(
        capitalize(dayjs(_value).locale(finalLocale).format(dateFormat))
      );
      closeDropdown();
      window.setTimeout(() => inputRef.current?.focus(), 0);
      onChange?.(_value as Date | null);
    };

    const inputFocus =
      'focus:ring-gs1-blue-300 focus-within:ring-gs1-blue-300 focus-within:border-gs1-blue-300 focus:border-gs1-blue-300 ';

    return (
      <BasePicker
        ref={useMergeRef(ref, inputRef)}
        className={cn(className, inputFocus)}
        clearable={clearable && !!_value && !disabled}
        disabled={disabled}
        dropdownOpened={dropdownOpened as boolean}
        inputLabel={inputState}
        inputPrefix={inputPrefix}
        inputSuffix={inputSuffix}
        inputtable={inputtable}
        name={name}
        setDropdownOpened={setDropdownOpened}
        size={size}
        onBlur={handleInputBlur}
        onChange={handleChange}
        onClear={handleClear}
        onDropdownClose={onDropdownClose}
        onDropdownOpen={onDropdownOpen}
        onFocus={handleInputFocus}
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
          preventFocus={false}
          renderDay={renderDay}
          value={
            _value instanceof Date ? _value : _value && dayjs(_value).toDate()
          }
          weekendDays={weekendDays}
          yearLabelFormat={yearLabelFormat}
          onChange={handleValueChange}
          onMonthChange={setCalendarMonth}
        />
        <div className="mt-4 flex items-center gap-4">
          <TimeInput
            clearable={false}
            disabled={!_value}
            format={'24'}
            size="sm"
            value={_value}
            onChange={handleTimeChange}
          />
          <Button disabled={!_value} size="sm" onClick={handleOk}>
            {okButtonContent}
          </Button>
        </div>
      </BasePicker>
    );
  }
);

DateTimepicker.displayName = 'DateTimepicker';

export default DateTimepicker;
