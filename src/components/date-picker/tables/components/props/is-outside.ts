import { isSameMonth } from '../../../utils/is-same-month';

export default function isOutside(date: Date, month: Date) {
  return !isSameMonth(date, month);
}
