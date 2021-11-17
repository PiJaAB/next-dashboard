import React from 'react';
import classNames from 'classnames';

export default function PageContent({
  // eslint-disable-next-line react/prop-types
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
