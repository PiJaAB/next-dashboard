// @flow
import React from 'react';

import NavEntry from './NavEntry';
import DashboardContext from '../utils/dashboardContext';

type Props = { children?: React$Node, icon?: React$Node };

export default function CompactButton({ children, icon }: Props): React$Node {
  return (
    <DashboardContext.Consumer>
      {ctx => {
        if (ctx == null) return null;
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
      }}
    </DashboardContext.Consumer>
  );
}

CompactButton.defaultProps = {
  children: undefined,
  icon: undefined,
};
