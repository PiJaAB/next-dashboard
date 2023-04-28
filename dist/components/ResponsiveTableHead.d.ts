/// <reference types="react" />
import type { ColData } from './ResponsiveTable';
export type Column<E, C> = ColData<E, C> & {
    readonly renderHead?: (column: Column<E, C>) => JSX.Element | null;
    readonly textAlign?: string;
};
type HeadProps<E, C> = {
    cols: readonly Column<E, C>[];
    columnKeyExtractor: (column: Column<E, C>) => string;
    renderHead: (column: Column<E, C>) => JSX.Element | null;
    onColumnClick?: (column: Column<E, C>) => void;
    type: 'body' | 'head';
};
declare const TableHead: <E extends {}, C>({ cols, columnKeyExtractor, renderHead, onColumnClick, type, }: HeadProps<E, C>) => JSX.Element;
export default TableHead;
