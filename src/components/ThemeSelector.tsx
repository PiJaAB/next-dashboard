import ReactTooltip from 'react-tooltip';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ColorSwatchIcon } from '@heroicons/react/outline';

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';
import useS from '../hooks/useS';

type Props = { children?: string };

export default function ThemeSelector({ children }: Props): JSX.Element {
  const { getState, setState, defaultColorScheme } = useContext(LayoutContext);
  const currentColorScheme = getState('colorScheme', defaultColorScheme);
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [reshow, setReshow] = useState(false);
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [currentColorScheme]);
  useEffect(() => {
    if (!reshow) return;
    console.log(ref);
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
