import classnames from 'classnames';
import React from 'react';

export type Props = React.PropsWithChildren<{
  id?: string;
}>;

export default function NavSection({ children, id }: Props): JSX.Element {
  return (
    <nav
      className={classnames(
        'dashboard-sidebar-menu',
        id && `dashboard-sidebar-menu_${id}`,
      )}
    >
      {children}
    </nav>
  );
}
