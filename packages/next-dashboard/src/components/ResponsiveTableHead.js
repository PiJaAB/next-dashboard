// @flow
import React, { useRef, useEffect, useContext } from 'react';
import { useMutationObserver, LayoutContext } from '../utils';
import type { TextAlignProps, ColData } from './ResponsiveTable';

export type Column<E, C> = $ReadOnly<{
  ...ColData<E, C>,
  +renderHead?: (column: Column<E, C>) => ?React$Node,
  +textAlign?: string,
}>;

type HeadProps<E, C> = {
  cols: $ReadOnlyArray<Column<E, C>>,
  columnKeyExtractor: (column: Column<E, C>) => string,
  textAlignClass: (props: TextAlignProps) => void | string,
  renderHead: (column: Column<E, C>) => ?React$Node,
  onColumnClick?: (column: Column<E, C>) => void,
};

const HEADER_OFFSET = 80; // Header is 80px tall

const update = (el: HTMLTableSectionElement, hasHeader: boolean) => {
  const rect = el.getClientRects()[0];
  if (!rect) return;
  const top = rect.top - (hasHeader ? HEADER_OFFSET : 0);
  if (top < 0) {
    const { style } = el;
    style.top = `${-top}px`;
  } else {
    const { style } = el;
    style.top = `0`;
  }
};

const TableHead = <E: {}, C>({
  cols,
  columnKeyExtractor,
  textAlignClass,
  renderHead,
  onColumnClick,
}: HeadProps<E, C>) => {
  const headRef = useRef<HTMLTableSectionElement | null>(null);
  const ctx = useContext(LayoutContext);
  const hasHeader = ctx.getState('hasHeader', true);
  useEffect(() => {
    const headEl = headRef.current;
    if (!headEl) return undefined;
    const onscroll = () => update(headEl, hasHeader);
    onscroll();
    window.addEventListener('scroll', onscroll);
    window.addEventListener('resize', onscroll);
    return () => {
      window.removeEventListener('scroll', onscroll);
      window.removeEventListener('resize', onscroll);
    };
  }, [headRef]);

  useMutationObserver(
    typeof document !== 'undefined' ? document.documentElement : null,
    {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    },
    () => {
      const headEl = headRef.current;
      if (!headEl) return;
      update(headEl, hasHeader);
    },
    [headRef.current, hasHeader],
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
