import React from 'react';
import type { Column as HeadColumn } from './ResponsiveTableHead';
export type ColData<E, C> = C & {
    readonly key?: string;
    readonly title: string;
    readonly field: keyof E;
    readonly htmlTooltip?: boolean;
    readonly useTooltip?: boolean;
};
export type TableColumn<E, C> = ColData<E, C> & {
    readonly renderHead?: (column: ColData<E, C>) => React.ReactNode | null | undefined;
    readonly renderBody?: (entry: E, column: ColData<E, C>, isTooltip: boolean) => React.ReactNode | null | undefined;
    renderCell?: (props: {
        row: E;
        column: ColData<E, C>;
        isLabel: boolean;
        children: React.ReactNode;
        dataTip?: string | null;
        dataHtml: boolean;
        className?: string;
    }) => JSX.Element;
    readonly textAlign?: string;
};
export interface Props<E, C> {
    className?: string;
    columns: readonly TableColumn<E, C>[];
    data?: readonly E[] | null;
    renderHead?: (column: ColData<E, C>) => JSX.Element | null;
    renderBody?: (entry: E, column: ColData<E, C>, isTooltip: boolean) => React.ReactNode | null | undefined;
    htmlTooltip?: boolean;
    columnKeyExtractor?: (column: ColData<E, C>) => string;
    dataKeyExtractor?: (entry: E) => string;
    onColumnClick?: (column: HeadColumn<E, C>) => void;
    style?: React.CSSProperties;
    rowHeight?: string | number;
    loading?: boolean;
    renderRow?: (props: {
        row: E;
        isLabel: boolean;
        children?: React.ReactNode;
    }) => JSX.Element;
    renderCell?: (props: {
        row: E;
        column: ColData<E, C>;
        isLabel: boolean;
        children: React.ReactNode;
        dataTip?: string | null;
        dataHtml: boolean;
        className?: string;
    }) => JSX.Element;
    emptyNode?: React.ReactNode;
}
export declare const defaultRenderHead: ({ title }: ColData<any, any>) => JSX.Element;
declare const ResponsiveTable: <E extends {}, C>({ className, columns, data, renderHead, renderBody, columnKeyExtractor, dataKeyExtractor, onColumnClick, style, rowHeight, htmlTooltip, loading, renderRow: RenderRow, renderCell, emptyNode, }: Props<E, C>) => JSX.Element;
export default ResponsiveTable;
