import React, { useContext } from 'react';
import ArrowSmallLeftIcon from '@heroicons/react/24/outline/ArrowSmallLeftIcon';
import ArrowSmallRightIcon from '@heroicons/react/24/outline/ArrowSmallRightIcon';
import LayoutContext from '../utils/layoutContext';
import useS from '../hooks/useS';
import NavEntry from './NavEntry';

export default function CompactMenuButton(): JSX.Element {
  const { getState, setState } = useContext(LayoutContext);
  const s = useS();
  const isCompact = getState('compactSidebar', false);
  return (
    <NavEntry
      Icon={isCompact ? ArrowSmallRightIcon : ArrowSmallLeftIcon}
      onClick={() => setState('compactSidebar', !isCompact)}
    >
      {s(isCompact ? 'sidebar-expand' : 'sidebar-compact')}
    </NavEntry>
  );
}
