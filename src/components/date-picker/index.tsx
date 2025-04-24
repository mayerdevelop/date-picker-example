import type { ForwardRefExoticComponent, RefAttributes } from 'react';

import _DatePicker, { DatePickerProps } from './date-picker';
import DateTimepicker from './date-time-picker';

export type { DatePickerProps } from './date-picker';

type CompoundedComponent = ForwardRefExoticComponent<
  DatePickerProps & RefAttributes<HTMLSpanElement>
> & {
  DateTimepicker: typeof DateTimepicker;
};
const DatePicker = _DatePicker as CompoundedComponent;

DatePicker.DateTimepicker = DateTimepicker;

export { DatePicker };

export default DatePicker;
