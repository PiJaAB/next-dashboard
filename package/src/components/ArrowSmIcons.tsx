import React, { forwardRef } from 'react';
import ArrowSmallLeftIcon from '@heroicons/react/24/outline/ArrowSmallLeftIcon';
import ArrowSmallRightIcon from '@heroicons/react/24/outline/ArrowSmallRightIcon';
import classNames from 'classnames';

export const ArrowSmallStartIcon = forwardRef(
  (
    { className, ...props }: React.ComponentPropsWithoutRef<'svg'>,
    ref: React.ForwardedRef<SVGSVGElement>,
  ): JSX.Element => {
    return (
      <ArrowSmallLeftIcon
        ref={ref}
        {...props}
        className={classNames(className, 'rtl:flip')}
      />
    );
  },
);

export const ArrowSmallEndIcon = forwardRef(
  (
    { className, ...props }: React.ComponentPropsWithoutRef<'svg'>,
    ref: React.ForwardedRef<SVGSVGElement>,
  ): JSX.Element => {
    return (
      <ArrowSmallRightIcon
        ref={ref}
        {...props}
        className={classNames(className, 'rtl:flip')}
      />
    );
  },
);
