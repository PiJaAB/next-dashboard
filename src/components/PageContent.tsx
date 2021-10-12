import React from 'react';

type Props = React.PropsWithChildren<{
  className?: string;
}>;

export default function PageContent({
  className,
  children,
  ...rest
}: Props): JSX.Element {
  return (
    <div className="card" {...rest}>
      {children}
    </div>
  );
}
