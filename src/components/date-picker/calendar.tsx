import { CommonProps } from '@/components/types/common';

import type { CalendarSharedProps } from './base-calendar';
import CalendarBase from './base-calendar';
import { isSameDate } from './utils/is-same-date';

export interface CalenderProps<MultipleSelection extends boolean = false>
  extends CommonProps,
    CalendarSharedProps {
  multipleSelection?: MultipleSelection;
  value?: MultipleSelection extends true ? Date[] : Date | null;
  onChange?(value: MultipleSelection extends true ? Date[] : Date | null): void;
}

const Calendar = <MultipleSelection extends boolean = false>(
  props: CalenderProps<MultipleSelection>
) => {
  const { multipleSelection, value, onChange, ...rest } = props;

  const handleChange = (date: Date | Date[]) => {
    if (!multipleSelection) {
      return onChange?.(date as MultipleSelection extends true ? Date[] : Date);
    }

    const isSelected = (value as Date[])?.some((val) =>
      isSameDate(val, date as Date)
    );

    return onChange?.(
      (isSelected
        ? (value as Date[])?.filter(
            (val: Date) => !isSameDate(val, date as Date)
          )
        : [...(value as Date[]), date]) as MultipleSelection extends true
        ? Date[]
        : Date
    );
  };

  return <CalendarBase value={value} onChange={handleChange} {...rest} />;
};

export default Calendar;
