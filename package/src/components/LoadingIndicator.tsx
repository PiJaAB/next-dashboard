import classNames from 'classnames';
import React from 'react';

export type LoadingIconProps = {
  className?: string;
};

export default function LoadingIndicator({
  className,
}: LoadingIconProps): JSX.Element {
  return <div className={classNames(className, 'loading-indicator')} />;
}
