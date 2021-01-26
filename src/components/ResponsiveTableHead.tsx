import React, { useRef, useEffect, useContext, useCallback } from 'react';
import { useMutationObserver } from 'src/hooks';
import { LayoutContext } from '../utils';
import type { ColData } from './ResponsiveTable';

export type Column<E, C> = ColData<E, C> & {
  readonly renderHead?: (column: Column<E, C>) => JSX.Element | null;
  readonly textAlign?: string;
};

type HeadProps<E, C> = {
  cols: readonly Column<E, C>[],
  columnKeyExtractor: (column: Column<E, C>) => string,
  textAlignClass: (alignment?: string) => undefined | string,
  renderHead: (column: Column<E, C>) => JSX.Element | null,
  onColumnClick?: (column: Column<E, C>) => void,
};

const HEADER_OFFSET = 70; // Header is 70px tall

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

const TableHead = <E extends {}, C>({
  cols,
  columnKeyExtractor,
  textAlignClass,
  renderHead,
  onColumnClick,
}: HeadProps<E, C>) => {
  const headRef = useRef<HTMLTableSectionElement | null>(null);
  const ctx = useContext(LayoutContext);
  const hasHeader = ctx.getTemp('hasHeader', true);
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

  const mutationCallback = useCallback(() => {
    const headEl = headRef.current;
    if (!headEl) return;
    update(headEl, hasHeader);
  }, [headRef.current, hasHeader]);

  useMutationObserver(
    typeof window !== 'undefined' ? window.document.documentElement : undefined,
    {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    },
    mutationCallback,
  );
  return (
    <thead ref={headRef}>
      <tr>
        {cols.map((column) => {
          return (
            <th
              key={columnKeyExtractor(column)}
              className={textAlignClass(column.textAlign)}
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

export default TableHead;
