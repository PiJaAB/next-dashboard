import React, { useContext } from 'react';

import type { Theme } from '../utils/types';

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';

type Props = { children?: string; icon?: React.ReactNode };

function rotateTheme(cur: Theme, themes: readonly Theme[]): Theme {
  return themes[
    (themes.findIndex((t) => t.class === cur.class) + 1) % themes.length
  ];
}

export default function ThemeSelector({ children, icon }: Props): JSX.Element {
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
