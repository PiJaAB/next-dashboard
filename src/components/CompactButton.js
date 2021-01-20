// @flow
import React, { useContext } from 'react';
/*:: import * as R from 'react'; */

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';

type Props = { children?: R.Node, icon?: R.Node };

export default function CompactButton({ children, icon }: Props): R.Node {
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
