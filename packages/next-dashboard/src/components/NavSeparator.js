// @flow

import React from 'react';

type Props = {
  children?: string,
};

export default function Nav({ children }: Props): React$Node {
  return (
    <div className="nav-separator">
      {children != null && (
        <span className="nav-separator-label">{children}</span>
      )}
    </div>
  );
}

Nav.defaultProps = {
  children: undefined,
};
