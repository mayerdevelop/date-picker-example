import { CommonProps } from '@/components/types/common';
import { cn } from '@/utils/cn';

import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

export interface HeaderProps extends CommonProps {
  hasNext: boolean;
  hasPrevious: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onNextLevel?: () => void;
  label?: string;
  nextLevelDisabled?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  preventLevelFocus?: boolean;
  preventFocus?: boolean;
}

const Header = (props: HeaderProps) => {
  const {
    hasNext,
    hasPrevious,
    onNext,
    onPrevious,
    onNextLevel,
    label,
    nextLevelDisabled,
    nextLabel,
    previousLabel,
    preventLevelFocus = false,
    preventFocus,
    children,
    className,
    ...rest
  } = props;

  const headerLabel = (
    <button
      className="picker-header-label"
      disabled={nextLevelDisabled}
      tabIndex={preventLevelFocus ? -1 : 0}
      type="button"
      onClick={onNextLevel}
      onMouseDown={(event) => preventFocus && event.preventDefault()}
    >
      {label}
    </button>
  );

  const renderChildren = children ? children : headerLabel;

  return (
    <div
      className={cn(
        'picker-header flex items-center justify-between mb-2 border-b border-gray-200 pb-2',
        className
      )}
      {...rest}
    >
      <div
        className={
          'flex w-full items-center justify-between rtl:flex-row-reverse'
        }
      >
        <button
          aria-label={previousLabel}
          className={cn(
            'picker-direction-button',
            !hasPrevious && 'opacity-0 cursor-default'
          )}
          disabled={!hasPrevious}
          type="button"
          onClick={onPrevious}
          onMouseDown={(event) => preventFocus && event.preventDefault()}
        >
          <BsChevronLeft />
        </button>
        {renderChildren}
        <button
          aria-label={nextLabel}
          className={cn(
            'picker-direction-button',
            !hasNext && 'opacity-0 cursor-default'
          )}
          disabled={!hasNext}
          type="button"
          onClick={onNext}
          onMouseDown={(event) => preventFocus && event.preventDefault()}
        >
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Header;
