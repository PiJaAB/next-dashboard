import React from 'react';
import classNames from 'classnames';

export default function PageContent({
  className,
  children,
  ...rest
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>): JSX.Element {
  return (
    <div className={classNames('card', className)} {...rest}>
      {children}
    </div>
  );
}
