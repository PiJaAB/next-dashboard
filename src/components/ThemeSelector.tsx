import ReactTooltip from 'react-tooltip';
import React, { useContext, useEffect, useRef, useState } from 'react';

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
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [reshow, setReshow] = useState(false);
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [theme]);
  useEffect(() => {
    if (!reshow) return;
    setReshow(false);
    if (ref.current != null) ReactTooltip.show(ref.current);
  }, [reshow]);
  return (
    <NavEntry
      icon={icon || 'palette'}
      onClick={() => {
        setReshow(true);
        setState<Theme>('theme', rotateTheme(theme, themes));
      }}
      tipRef={ref}
    >
      {children || `Theme: ${theme.name}`}
    </NavEntry>
  );
}
