// @flow

import React from 'react';
/*:: import * as R from 'react'; */

type Props = {
  children?: string,
};

export default function Nav({ children }: Props): R.Node {
  return (
    <div className="nav-separator">
      {children != null && (
        <span className="nav-separator-label">{children}</span>
      )}
    </div>
  );
}
