import type {
  ClassAttributes,
  ElementType,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { useForm, useFormItem } from '@/components/form/context';
import { CommonProps, ControlSize } from '@/components/types/common';
import { cn } from '@/utils/cn';
import { CONTROL_SIZES } from '@/utils/form-constants';

import { isNil } from 'lodash';

export interface InputProps
  extends CommonProps,
    Omit<
      InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
      'size' | 'prefix'
    > {
  asElement?: ElementType;
  disabled?: boolean;
  invalid?: boolean;
  prefix?: string | ReactNode;
  rows?: number;
  size?: ControlSize;
  suffix?: string | ReactNode;
  textArea?: boolean;
  type?: HTMLInputTypeAttribute;
}

const Input = forwardRef<
  ElementType | HTMLInputElement | HTMLTextAreaElement,
  InputProps
>((props, ref) => {
  const {
    asElement: Component = 'input',
    className,
    disabled,
    invalid,
    prefix,
    size,
    suffix,
    textArea,
    type = 'text',
    rows,
    style,
    ...rest
  } = props;

  const [prefixGutter, setPrefixGutter] = useState(0);
  const [suffixGutter, setSuffixGutter] = useState(0);

  const formControlSize = useForm()?.size;
  const formItemInvalid = useFormItem()?.invalid;

  const inputSize = size || formControlSize;
  const isInputInvalid = invalid || formItemInvalid;

  const fixControlledValue = (
    val: string | number | readonly string[] | undefined
  ) => {
    if (typeof val === 'undefined' || val === null) {
      return '';
    }

    return val;
  };

  if ('value' in props) {
    rest.value = fixControlledValue(props.value);
    delete rest.defaultValue;
  }

  const inputDefaultClass = 'input';
  const inputSizeClass = inputSize
    ? `input-${inputSize} ${CONTROL_SIZES[inputSize as keyof typeof CONTROL_SIZES].h}`
    : '';
  const inputFocusClass = `focus:ring-gs1-blue-300 focus-within:ring-gs1-blue-300 focus-within:border-gs1-blue-300 focus:border-gs1-blue-300`;
  const inputWrapperClass = cn(
    'input-wrapper',
    prefix || suffix ? className : ''
  );
  const inputClass = cn(
    inputDefaultClass,
    !textArea && inputSizeClass,
    !isInputInvalid && inputFocusClass,
    className,
    // !prefix && !suffix ? className : '',// ignoring classname when pass suffix or prefix
    disabled && 'input-disabled',
    isInputInvalid && 'input-invalid',
    textArea && 'input-textarea'
  );

  const prefixNode = useRef<HTMLDivElement>(null);
  const suffixNode = useRef<HTMLDivElement>(null);

  const getAffixSize = () => {
    if (!prefixNode.current && !suffixNode.current) {
      return;
    }
    const prefixNodeWidth = prefixNode?.current?.offsetWidth;
    const suffixNodeWidth = suffixNode?.current?.offsetWidth;

    if (isNil(prefixNodeWidth) && isNil(suffixNodeWidth)) {
      return;
    }

    if (prefixNodeWidth) {
      setPrefixGutter(prefixNodeWidth);
    }

    if (suffixNodeWidth) {
      setSuffixGutter(suffixNodeWidth);
    }
  };

  useEffect(() => {
    getAffixSize();
  }, [prefix, suffix]);

  const remToPxConvertion = (pixel: number) => 0.0625 * pixel;

  const affixGutterStyle = () => {
    const leftGutter = `${remToPxConvertion(prefixGutter) + 3}rem`;
    const rightGutter = `${remToPxConvertion(suffixGutter) + 3}rem`;
    const gutterStyle: {
      paddingLeft?: string;
      paddingRight?: string;
    } = {};

    if (prefix) {
      gutterStyle.paddingLeft = leftGutter;
    }

    if (suffix) {
      gutterStyle.paddingRight = rightGutter;
    }

    return gutterStyle;
  };

  const inputProps = {
    className: inputClass,
    disabled,
    type,
    ref,
    ...rest,
  };

  const renderTextArea = (
    <textarea
      rows={rows}
      style={style}
      {...(inputProps as ClassAttributes<HTMLTextAreaElement>)}
    ></textarea>
  );

  const renderInput = (
    <Component style={{ ...affixGutterStyle(), ...style }} {...inputProps} />
  );

  const renderAffixInput = (
    <span className={inputWrapperClass}>
      {prefix ? <div className="input-suffix-start">{prefix}</div> : null}
      {renderInput}
      {suffix ? <div className="input-suffix-end">{suffix}</div> : null}
    </span>
  );

  const renderChildren = () => {
    if (textArea) {
      return renderTextArea;
    }

    if (prefix || suffix) {
      return renderAffixInput;
    } else {
      return renderInput;
    }
  };

  return renderChildren();
});

Input.displayName = 'Input';

export default Input;
