import ReactTooltip from 'react-tooltip';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ColorSwatchIcon from '@heroicons/react/outline/ColorSwatchIcon';

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';
import useS from '../hooks/useS';
import useRebuildTooltip from '../hooks/useRebuildTooltip';

type Props = { children?: string };

export default function ThemeSelector({ children }: Props): JSX.Element {
  const { getState, setState, defaultColorScheme } = useContext(LayoutContext);
  const currentColorScheme = getState('colorScheme', defaultColorScheme);
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [reshow, setReshow] = useState(false);
  const rebuildTooltip = useRebuildTooltip();
  useEffect(() => {
    rebuildTooltip();
  }, [currentColorScheme, rebuildTooltip]);
  useEffect(() => {
    if (!reshow) return;
    setReshow(false);
    if (ref.current != null) ReactTooltip.show(ref.current);
  }, [reshow]);
  const s = useS();
  return (
    <NavEntry
      Icon={ColorSwatchIcon}
      onClick={() => {
        setReshow(true);
        setState(
          'colorScheme',
          currentColorScheme === 'dark' ? 'light' : 'dark',
        );
      }}
      tipRef={ref}
    >
      {children || s(`theme-${currentColorScheme}`)}
    </NavEntry>
  );
}
