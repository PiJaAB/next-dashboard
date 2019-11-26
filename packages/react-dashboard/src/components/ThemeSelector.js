// @flow
import React from 'react';

import type { Theme } from '../utils/types';

import NavEntry from './NavEntry';
import DashboardContext from '../utils/dashboardContext';

type Props = { children?: React$Node, icon?: React$Node };

function rotateTheme(cur: Theme, themes: Theme[]): string {
  return themes[
    (themes.findIndex(t => t.class === cur.class) + 1) % themes.length
  ].class;
}

export default function ThemeSelector({ children, icon }: Props): React$Node {
  return (
    <DashboardContext.Consumer>
      {ctx => {
        if (ctx == null) return null;
        const { setState, theme, themes } = ctx;
        return (
          <NavEntry
            icon={icon || 'exchange-alt'}
            onClick={() =>
              setState<string>('theme', rotateTheme(theme, themes))
            }
          >
            {children || `Theme: ${theme.name}`}
          </NavEntry>
        );
      }}
    </DashboardContext.Consumer>
  );
}

ThemeSelector.defaultProps = {
  children: undefined,
  icon: undefined,
};
