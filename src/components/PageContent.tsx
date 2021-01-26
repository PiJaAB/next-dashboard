import React from 'react';
import classnames from 'classnames';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export default function PageContent({
  className,
  children,
  ...rest
}: Props): JSX.Element {
  return (
    <div className={classnames('page-content', className)} {...rest}>
      {children}
    </div>
  );
}
