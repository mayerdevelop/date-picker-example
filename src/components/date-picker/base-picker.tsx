import type {
  ChangeEvent,
  FocusEvent,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import { forwardRef } from 'react';

import useMergeRef from '@/components/hooks/use-merge-ref';
import { CommonProps, ControlSize } from '@/components/types/common';

import CloseButton from '../close-button';
import Input from '../input';

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { BsCalendarMinus } from 'react-icons/bs';

dayjs.extend(localizedFormat);

export interface BasePickerSharedProps {
  clearable?: boolean;
  clearButton?: string | ReactNode;
  disabled?: boolean;
  inputtable?: boolean;
  inputPrefix?: string | ReactNode;
  inputSuffix?: string | ReactNode;
  name?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void;
  onDropdownOpen?: () => void;
  onDropdownClose?: () => void;
  onFocus?: (event: FocusEvent<HTMLInputElement, Element>) => void;
  placeholder?: string;
  size?: ControlSize;
  type?: HTMLInputTypeAttribute;
}

interface BasePickerProps extends CommonProps, BasePickerSharedProps {
  dropdownOpened: boolean;
  inputtableBlurClose?: boolean;
  inputLabel?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onClear?: (event: MouseEvent<HTMLElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  setDropdownOpened: (opened: boolean) => void;
}

const BasePicker = forwardRef<HTMLInputElement, BasePickerProps>(
  (props, ref) => {
    const {
      className,
      clearable = true,
      clearButton,
      children,
      disabled,
      dropdownOpened,
      inputtable,
      inputtableBlurClose = false,
      inputLabel,
      inputPrefix,
      inputSuffix = <BsCalendarMinus className="text-lg" />,
      name,
      onDropdownOpen,
      onDropdownClose,
      onBlur,
      onFocus,
      onChange,
      onKeyDown,
      onClear,
      placeholder,
      setDropdownOpened,
      size,
      type,
    } = props;

    const handleInputClick = () => {
      if (inputtable) {
        openDropdown();
      } else {
        toggleDropdown(!dropdownOpened);
      }
    };

    const closeDropdown = () => {
      setDropdownOpened(false);
      onDropdownClose?.();
    };

    const suffixIconSlot = clearable ? (
      clearButton ? (
        <div role="presentation" onClick={onClear}>
          {clearButton}
        </div>
      ) : (
        <CloseButton className="text-base" onClick={onClear} />
      )
    ) : inputSuffix ? (
      <>{inputSuffix}</>
    ) : null;

    const toggleDropdown = (open: boolean) => {
      setDropdownOpened(open);
      if (open) {
        onDropdownOpen?.();
      } else {
        onDropdownClose?.();
      }
    };

    const openDropdown = () => {
      setDropdownOpened(true);
      onDropdownOpen?.();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (typeof onKeyDown === 'function') {
        onKeyDown(event);
      }
      if ((event.key === 'Space' || event.key === 'Enter') && !inputtable) {
        event.preventDefault();
        openDropdown();
      }
    };

    const handleInputBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
      onBlur?.(event);
      if (inputtable && inputtableBlurClose) {
        closeDropdown();
      }
    };

    const handleInputFocus = (event: FocusEvent<HTMLInputElement, Element>) => {
      onFocus?.(event);
    };

    const { refs, floatingStyles, context } = useFloating({
      open: dropdownOpened,
      onOpenChange: toggleDropdown,
      placement: 'bottom-start',
      middleware: [
        offset(10),
        flip({
          fallbackAxisSideDirection: 'start',
        }),
        shift(),
      ],
      whileElementsMounted: autoUpdate,
    });

    const focus = useFocus(context);
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
      inputtable ? focus : click,
      dismiss,
      role,
    ]);

    const headingId = useId();

    return (
      <>
        <Input
          ref={useMergeRef(ref, refs.setReference)}
          asElement={'input'}
          autoComplete="off"
          className={className}
          disabled={disabled}
          name={name}
          placeholder={placeholder}
          prefix={inputPrefix}
          readOnly={!inputtable}
          size={size}
          suffix={suffixIconSlot}
          type={type}
          value={inputLabel}
          onChange={onChange}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          {...getReferenceProps({
            onBlur: handleInputBlur,
            onFocus: handleInputFocus,
          })}
        />
        {dropdownOpened && (
          <div
            ref={refs.setFloating}
            aria-labelledby={headingId}
            className="picker"
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <div className="picker-panel">{children}</div>
          </div>
        )}
      </>
    );
  }
);

BasePicker.displayName = 'BasePicker';

export default BasePicker;
