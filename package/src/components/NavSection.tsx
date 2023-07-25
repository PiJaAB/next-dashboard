import classNames from 'classnames';
import React from 'react';

export type Props = React.PropsWithChildren<{
  className?: string;
}>;

export default function NavSection({
  children,
  className,
}: Props): JSX.Element {
  return <div className={classNames('space-y-1', className)}>{children}</div>;
}
