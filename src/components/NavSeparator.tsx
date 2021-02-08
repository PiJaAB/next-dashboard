import React from 'react';

type Props = React.PropsWithChildren<{}>;

export default function Nav({ children }: Props): JSX.Element {
  return (
    <div className="nav-separator">
      {children != null && (
        <span className="nav-separator-label">{children}</span>
      )}
    </div>
  );
}
