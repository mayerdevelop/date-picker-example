import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import { FormItemContextProvider, useForm } from '@/components/form/context';
import { CommonProps, ControlSize, FormLayout } from '@/components/types/common';
import { cn } from '@/utils/cn';
import { CONTROL_SIZES, LAYOUT } from '@/utils/form-constants';

import { AnimatePresence, motion } from 'framer-motion';

export interface FormItemProps extends CommonProps {
  asterisk?: boolean;
  errorMessage?: string;
  extra?: string | ReactNode;
  htmlFor?: string;
  invalid?: boolean;
  label?: string;
  labelClass?: string;
  labelWidth?: string | number;
  layout?: FormLayout;
  size?: ControlSize;
}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
  const {
    asterisk,
    children,
    className,
    errorMessage,
    extra,
    htmlFor,
    invalid,
    label,
    labelClass,
    labelWidth,
    layout,
    style,
    size,
  } = props;

  const formContext = useForm();

  const formItemLabelHeight = size || formContext?.size;
  const formItemLabelWidth = labelWidth || formContext?.labelWidth;
  const formItemLayout = layout || formContext?.layout || 'vertical';

  const getFormLabelLayoutClass = () => {
    if (!formItemLabelHeight) return '';
    switch (formItemLayout) {
      case LAYOUT.HORIZONTAL:
        return label
          ? `${CONTROL_SIZES[formItemLabelHeight].h} ${
              label && 'ltr:pr-2 rtl:pl-2'
            }`
          : 'ltr:pr-2 rtl:pl-2';
      case LAYOUT.VERTICAL:
        return `mb-2`;
      case LAYOUT.INLINE:
        return `${CONTROL_SIZES[formItemLabelHeight].h} ${
          label && 'ltr:pr-2 rtl:pl-2'
        }`;
      default:
        return '';
    }
  };

  const formItemClass = cn(
    'form-item',
    formItemLayout,
    className,
    invalid ? 'invalid' : ''
  );

  const formLabelClass = cn(
    'form-label',
    label && getFormLabelLayoutClass(),
    labelClass
  );

  const formLabelStyle = () => {
    if (formItemLayout === LAYOUT.HORIZONTAL) {
      return { ...style, ...{ minWidth: formItemLabelWidth } };
    }

    return { ...style };
  };

  const enterStyle = { opacity: 1, marginTop: 3, bottom: -21 };
  const exitStyle = { opacity: 0, marginTop: -10 };
  const initialStyle = exitStyle;

  return (
    <FormItemContextProvider value={{ invalid }}>
      <div ref={ref} className={formItemClass}>
        <label
          className={formLabelClass}
          htmlFor={htmlFor}
          style={formLabelStyle()}
        >
          {asterisk && (
            <span className="text-red-500 ltr:mr-1 rtl:ml-1">*</span>
          )}
          {label}
          {extra && <span>{extra}</span>}
          {label && formItemLayout !== 'vertical' && ':'}
        </label>
        <div
          className={
            formItemLayout === LAYOUT.HORIZONTAL
              ? 'relative flex w-full flex-col justify-center'
              : ''
          }
        >
          {children}
          <AnimatePresence mode="wait">
            {invalid && (
              <motion.div
                animate={enterStyle}
                className="form-explain"
                exit={exitStyle}
                initial={initialStyle}
                transition={{ duration: 0.15, type: 'tween' }}
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FormItemContextProvider>
  );
});

FormItem.displayName = 'FormItem';

export default FormItem;
