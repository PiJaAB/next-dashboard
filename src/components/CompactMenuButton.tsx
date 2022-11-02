import React, { useContext } from 'react';
import ArrowSmLeftIcon from '@heroicons/react/outline/ArrowSmLeftIcon';
import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import LayoutContext from '../utils/layoutContext';
import useS from '../hooks/useS';
import NavEntry from './NavEntry';

export default function CompactMenuButton(): JSX.Element {
  const { getState, setState } = useContext(LayoutContext);
  const s = useS();
  const isCompact = getState('compactSidebar', false);
  return (
    <NavEntry
      Icon={isCompact ? ArrowSmRightIcon : ArrowSmLeftIcon}
      onClick={() => setState('compactSidebar', !isCompact)}
    >
      {s(isCompact ? 'sidebar-expand' : 'sidebar-compact')}
    </NavEntry>
  );
}
