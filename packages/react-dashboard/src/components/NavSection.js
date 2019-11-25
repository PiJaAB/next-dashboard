// @flow

import React from 'react';

type Props = {
  children: React$Node,
};

export default function NavEntry({ children }: Props): React$Node {
  return (
    <>
      {children}
      <div className="dashboard-sidebar-menu-item-space" />
    </>
  );
}
