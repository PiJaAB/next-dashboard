import React from 'react';
import ArrowSmLeftIcon from '@heroicons/react/outline/ArrowSmLeftIcon';
import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import classNames from 'classnames';

export function ArrowSmStartIcon({
  className,
  ...props
}: React.ComponentProps<'svg'>): JSX.Element {
  return (
    <ArrowSmLeftIcon {...props} className={classNames(className, 'rtl:flip')} />
  );
}

export function ArrowSmEndIcon({
  className,
  ...props
}: React.ComponentProps<'svg'>): JSX.Element {
  return (
    <ArrowSmRightIcon
      {...props}
      className={classNames(className, 'rtl:flip')}
    />
  );
}
