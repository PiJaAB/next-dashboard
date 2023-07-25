import ReactTooltip from 'react-tooltip';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SwatchIcon from '@heroicons/react/24/outline/SwatchIcon';

import NavEntry from './NavEntry';
import LayoutContext from '../utils/layoutContext';
import useS from '../hooks/useS';
import useRebuildTooltip from '../hooks/useRebuildTooltip';
import useColorScheme from '../hooks/useColorScheme';

type Props = { children?: string };

export default function ThemeSelector({ children }: Props): JSX.Element {
  const { setState } = useContext(LayoutContext);
  const currentColorScheme = useColorScheme();
  const ref = useRef<HTMLButtonElement>(null);
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
      Icon={SwatchIcon}
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
