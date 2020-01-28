// @flow
import React, { useRef, useEffect } from 'react';
import { useMutationObserver } from '../utils';
import type { TextAlignProps, ColData, Entry } from './ResponsiveTable';

export type Column<D: Entry> = $ReadOnly<{
  ...ColData<D>,
  +renderHead?: (column: Column<D>) => ?React$Node,
  +textAlign?: string,
}>;

type HeadProps<D: Entry> = {
  cols: $ReadOnlyArray<Column<D>>,
  columnKeyExtractor: (column: Column<D>) => string,
  textAlignClass: (props: TextAlignProps) => void | string,
  renderHead: (column: Column<D>) => ?React$Node,
  onColumnClick?: (column: Column<D>) => void,
};

const HEADER_OFFSET = 80; // Header is 80px long

const update = (el: HTMLTableSectionElement) => {
  const rect = el.getClientRects()[0];
  const top = rect.top - HEADER_OFFSET;
  if (top < 0) {
    const { style } = el;
    style.top = `${-top}px`;
  } else {
    const { style } = el;
    style.top = `0`;
  }
};

const TableHead = <D: Entry>({
  cols,
  columnKeyExtractor,
  textAlignClass,
  renderHead,
  onColumnClick,
}: HeadProps<D>) => {
  const headRef = useRef<HTMLTableSectionElement | null>(null);
  useEffect(() => {
    const headEl = headRef.current;
    if (!headEl) return undefined;
    const onscroll = () => update(headEl);
    onscroll();
    window.addEventListener('scroll', onscroll);
    window.addEventListener('resize', onscroll);
    return () => {
      window.removeEventListener('scroll', onscroll);
      window.removeEventListener('resize', onscroll);
    };
  }, [headRef]);

  useMutationObserver(
    document.documentElement,
    {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    },
    () => {
      const headEl = headRef.current;
      if (!headEl) return;
      update(headEl);
    },
  );
  return (
    <thead ref={headRef}>
      <tr>
        {cols.map(column => {
          return (
            <th
              key={columnKeyExtractor(column)}
              className={textAlignClass(column)}
              onClick={onColumnClick && (() => onColumnClick(column))}
            >
              {(column.renderHead || renderHead)(column)}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

TableHead.defaultProps = {
  onColumnClick: undefined,
};

export default TableHead;
