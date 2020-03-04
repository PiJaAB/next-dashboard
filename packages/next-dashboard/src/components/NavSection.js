// @flow

import React from 'react';
/*:: import * as R from 'react'; */

type Props = {
  children: R.Node,
  id?: string,
};

export default function NavEntry({ children, id }: Props): R.Node {
  return (
    <nav
      className={[
        'dashboard-sidebar-menu',
        id && `dashboard-sidebar-menu_${id}`,
      ]
        .filter(c => c)
        .join(' ')}
    >
      {children}
    </nav>
  );
}

NavEntry.defaultProps = {
  id: undefined,
};
