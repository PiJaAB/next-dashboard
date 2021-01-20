// @flow
import React, { useContext } from 'react';
/*:: import * as R from 'react'; */

import type { Theme } from '../utils/types';

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';

type Props = { children?: R.Node, icon?: R.Node };

function rotateTheme(cur: Theme, themes: $ReadOnlyArray<Theme>): Theme {
  return themes[
    (themes.findIndex(t => t.class === cur.class) + 1) % themes.length
  ];
}

export default function ThemeSelector({ children, icon }: Props): R.Node {
  const ctx = useContext(LayoutContext);
  const { setState, theme, themes } = ctx;
  return (
    <NavEntry
      icon={icon || 'palette'}
      onClick={() => setState<Theme>('theme', rotateTheme(theme, themes))}
    >
      {children || `Theme: ${theme.name}`}
    </NavEntry>
  );
}
