import type { FormContextProps } from '@/components/form/context';
import {
  FormContextConsumer,
  FormContextProvider,
} from '@/components/form/context';
import { CommonProps, ControlSize, FormLayout } from '@/components/types/common';
import { cn } from '@/utils/cn';
import { LAYOUT, SIZES } from '@/utils/form-constants';

export interface FormContainerProps extends CommonProps {
  size?: ControlSize;
  layout?: FormLayout;
  labelWidth?: string | number;
}

const FormContainer = (props: FormContainerProps) => {
  const {
    children,
    className,
    labelWidth = 100,
    layout = LAYOUT.VERTICAL,
    size = SIZES.MD,
  } = props;

  const contextValue = {
    labelWidth,
    layout,
    size: size,
  };

  return (
    <FormContextProvider value={contextValue as FormContextProps}>
      <FormContextConsumer>
        {(context) => {
          return (
            <div className={cn('form-container', context?.layout, className)}>
              {children}
            </div>
          );
        }}
      </FormContextConsumer>
    </FormContextProvider>
  );
};

FormContainer.displayName = 'FormContainer';

export default FormContainer;
