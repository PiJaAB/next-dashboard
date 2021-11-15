/// <reference types="react" />
import { Props as TableProps } from './ResponsiveTable';
declare type Compare<E> = (a: E, b: E, prop: string, dir: 'asc' | 'desc') => number;
declare type CompareBy<E> = (entry: E, prop: string, dir: 'asc' | 'desc') => string | number;
export declare type Props<E, C> = TableProps<E, C> & {
    compare?: Compare<E>;
    compareBy?: CompareBy<E>;
    title?: string;
};
declare const SortableTable: <E extends {} = {
    [key: string]: unknown;
}, C extends {} = {}>({ data: orgData, onColumnClick, compare, compareBy, renderHead, className, title, ...props }: Props<E, C>) => JSX.Element;
export default SortableTable;
