import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import type { FormContainerProps } from '@/components/form/form-container';
import FormContainer from '@/components/form/form-container';

export type FormProps = ComponentPropsWithoutRef<'form'> &
  FormContainerProps & {
    containerClassName?: string;
  };

export const Form = forwardRef<HTMLFormElement, FormProps>(
  (props: FormProps, ref) => {
    const { children, containerClassName, labelWidth, layout, size, ...rest } =
      props;

    return (
      <form ref={ref} {...rest}>
        <FormContainer
          className={containerClassName}
          labelWidth={labelWidth}
          layout={layout}
          size={size}
        >
          {children}
        </FormContainer>
      </form>
    );
  }
);

Form.displayName = 'Form';

export default Form;
