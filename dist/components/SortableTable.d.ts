/// <reference types="react" />
import { Props as TableProps } from './ResponsiveTable';
type Compare<E> = (a: E, b: E, prop: string | number | symbol, dir: 'asc' | 'desc') => number;
type CompareBy<E> = (entry: E, prop: string | number | symbol, dir: 'asc' | 'desc') => string | number | null | undefined;
export type Props<E, C> = TableProps<E, C> & {
    compare?: Compare<E>;
    compareBy?: CompareBy<E>;
    title?: string;
};
export default function SortableTable<E extends {} = {
    [key: string]: unknown;
}, C extends {} = {}>({ data: orgData, onColumnClick, compare, compareBy, renderHead, className, title, ...props }: Props<E, C>): JSX.Element;
export {};
