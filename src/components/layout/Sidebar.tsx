import React from 'react';

type Props = React.PropsWithChildren<{
  sidebarActive: boolean;
  sidebarCompact: boolean;
}>;

const Sidebar = ({
  sidebarActive,
  sidebarCompact,
  children,
}: Props): JSX.Element => {
  return (
    <div
      className={[
        'dashboard-sidebar',
        sidebarActive && 'dashboard-sidebar_active',
        sidebarCompact && 'dashboard-sidebar_compact',
      ]
        .filter((className) => className)
        .join(' ')}
    >
      {children}
    </div>
  );
};

export default Sidebar;
