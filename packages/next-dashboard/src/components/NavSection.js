// @flow

import React from 'react';

type Props = {
  children: React$Node,
  id?: string,
};

export default function NavEntry({ children, id }: Props): React$Node {
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
