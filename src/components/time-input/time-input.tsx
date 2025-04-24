import type { ReactNode, Ref, RefObject } from 'react';
import { forwardRef, useRef, useState } from 'react';

import { useFormItem } from '@/components/form/context';
import useDidUpdate from '@/components/hooks/use-did-update';
import useMergeRef from '@/components/hooks/use-merge-ref';
import useUniqueId from '@/components/hooks/use-unique-id';
import { CommonProps, ControlSize } from '@/components/types/common';

import CloseButton from '../close-button';
import Input from '../input';
import AmPmInput from './am-pm-input';
import TimeInputField from './time-input-field';
import {
  createAmPmHandler,
  createTimeHandler,
  getDate,
  getTimeValues,
} from './utils';

import { HiOutlineClock } from 'react-icons/hi';

type Value = Date | null;

export interface TimeInputProps extends CommonProps {
  amLabel?: string;
  amPmPlaceholder?: string;
  clearable?: boolean;
  defaultValue?: Value;
  disabled?: boolean;
  format?: '12' | '24';
  id?: string;
  invalid?: boolean;
  name?: string;
  nextRef?: RefObject<HTMLInputElement>;
  onChange?: (value: Value) => void;
  pmLabel?: string;
  prefix?: string | ReactNode;
  showSeconds?: boolean;
  size?: ControlSize;
  suffix?: string | ReactNode;
  timeFieldPlaceholder?: string;
  timeFieldClass?: string;
  unstyle?: boolean;
  value?: Value;
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
  const {
    amLabel = 'am',
    amPmPlaceholder = 'am',
    className,
    clearable = true,
    defaultValue,
    disabled = false,
    format = '24',
    id,
    invalid,
    name,
    nextRef,
    onChange,
    pmLabel = 'pm',
    prefix,
    showSeconds = false,
    size = 'md',
    style,
    suffix = <HiOutlineClock className="text-lg" />,
    timeFieldPlaceholder = '--',
    timeFieldClass,
    value,
    ...rest
  } = props;

  const uuid = useUniqueId(id);

  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);
  const amPmRef = useRef<HTMLInputElement>(null);
  const [time, setTime] = useState(
    getTimeValues(value || (defaultValue as Date), format, amLabel, pmLabel)
  );
  const [_value, setValue] = useState<Value>(
    (value as Date) || (defaultValue as Date)
  );

  const formItemInvalid = useFormItem()?.invalid;
  const isTimeInputInvalid = invalid || formItemInvalid;

  useDidUpdate(() => {
    setTime(getTimeValues(_value as Date, format, amLabel, pmLabel));
  }, [_value, format, amLabel, pmLabel]);

  useDidUpdate(() => {
    if (value?.getTime() !== _value?.getTime()) {
      setValue(value as Date | null);
    }
  }, [value]);

  const setDate = (change: Partial<typeof time>) => {
    const timeWithChange = { ...time, ...change };
    const newDate = getDate(
      timeWithChange.hours,
      timeWithChange.minutes,
      timeWithChange.seconds,
      format,
      pmLabel,
      timeWithChange.amPm
    );

    setValue(newDate);
    if (typeof onChange === 'function') {
      onChange(newDate);
    }
  };

  const handleHoursChange = createTimeHandler({
    onChange: (val, carryOver) => {
      setDate({
        hours: val,
        minutes: carryOver ?? time.minutes,
      });
    },
    min: format === '12' ? 1 : 0,
    max: format === '12' ? 12 : 23,
    nextRef: minutesRef as RefObject<HTMLInputElement>,
    nextMax: 59,
  });

  const handleMinutesChange = createTimeHandler({
    onChange: (val, carryOver) => {
      setDate({
        minutes: val,
        seconds: carryOver ?? time.seconds,
      });
    },
    min: 0,
    max: 59,
    nextRef: showSeconds
      ? (secondsRef as RefObject<HTMLInputElement>)
      : format === '12'
        ? (amPmRef as RefObject<HTMLInputElement>)
        : (nextRef as RefObject<HTMLInputElement>),
    nextMax: showSeconds ? 59 : undefined,
  });

  const handleSecondsChange = createTimeHandler({
    onChange: (val) => {
      setDate({ seconds: val });
    },
    min: 0,
    max: 59,
    nextRef:
      format === '12'
        ? (amPmRef as RefObject<HTMLInputElement>)
        : (nextRef as RefObject<HTMLInputElement>),
  });

  const handleAmPmChange = createAmPmHandler({
    amLabel,
    pmLabel,
    onChange: (val) => {
      setDate({ amPm: val });
    },
    nextRef,
  });

  const handleClear = () => {
    setTime({ hours: '', minutes: '', seconds: '', amPm: '' });
    setValue(null);
    onChange?.(null);
    hoursRef?.current?.focus();
  };

  const suffixSlot =
    clearable && _value ? <CloseButton onClick={handleClear} /> : suffix;

  return (
    <Input
      asElement="div"
      className={className}
      disabled={disabled}
      invalid={isTimeInputInvalid}
      prefix={prefix}
      size={size}
      style={style}
      suffix={suffixSlot}
      onClick={() => hoursRef?.current?.focus()}
      {...rest}
    >
      <div className="time-input-wrapper">
        <TimeInputField
          ref={useMergeRef(hoursRef as Ref<HTMLInputElement>, ref)}
          withSeparator
          aria-label="hours"
          className={timeFieldClass}
          disabled={disabled}
          id={uuid}
          max={format === '12' ? 12 : 23}
          name={name}
          placeholder={timeFieldPlaceholder}
          setValue={(val) => setTime((current) => ({ ...current, hours: val }))}
          value={time.hours}
          onChange={handleHoursChange}
        />
        <TimeInputField
          ref={minutesRef as Ref<HTMLInputElement>}
          aria-label="minutes"
          className={timeFieldClass}
          disabled={disabled}
          max={59}
          placeholder={timeFieldPlaceholder}
          setValue={(val) =>
            setTime((current) => ({ ...current, minutes: val }))
          }
          value={time.minutes}
          withSeparator={showSeconds}
          onChange={handleMinutesChange}
        />
        {showSeconds && (
          <TimeInputField
            ref={secondsRef as Ref<HTMLInputElement>}
            aria-label="seconds"
            className={timeFieldClass}
            disabled={disabled}
            max={59}
            placeholder={timeFieldPlaceholder}
            setValue={(val) =>
              setTime((current) => ({ ...current, seconds: val }))
            }
            value={time.seconds}
            onChange={handleSecondsChange}
          />
        )}
        {format === '12' && (
          <AmPmInput
            ref={amPmRef as Ref<HTMLInputElement>}
            amLabel={amLabel}
            aria-label="am pm"
            disabled={disabled}
            placeholder={amPmPlaceholder}
            pmLabel={pmLabel}
            value={time.amPm}
            onChange={handleAmPmChange}
          />
        )}
      </div>
    </Input>
  );
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
