import React, { useContext } from 'react';

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';

interface Props {
  children?: string;
  icon?: React.ReactNode;
}

export default function CompactButton({ children, icon }: Props): JSX.Element {
  const ctx = useContext(LayoutContext);
  const { getState, setState } = ctx;
  return (
    <NavEntry
      icon={icon || 'exchange-alt'}
      onClick={() =>
        setState<boolean>(
          'sidebarCompact',
          !getState<boolean>('sidebarCompact', false),
        )
      }
    >
      {children || 'Compact'}
    </NavEntry>
  );
}
