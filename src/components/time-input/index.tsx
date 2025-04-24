import type { ForwardRefExoticComponent, RefAttributes } from 'react';

import _TimeInput, { TimeInputProps } from './time-input';

export type { TimeInputProps } from './time-input';

type CompoundedComponent = ForwardRefExoticComponent<
  TimeInputProps & RefAttributes<HTMLSpanElement>
> & {};

const TimeInput = _TimeInput as CompoundedComponent;

export { TimeInput };

export default TimeInput;
