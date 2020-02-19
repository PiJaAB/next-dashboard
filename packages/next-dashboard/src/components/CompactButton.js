// @flow
import React, { useContext } from 'react';

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';

type Props = { children?: string, icon?: React$Node };

export default function CompactButton({ children, icon }: Props): React$Node {
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

CompactButton.defaultProps = {
  children: undefined,
  icon: undefined,
};
