import React from 'react';
export interface ILayoutContext {
    getState<T>(key: string, defaultValue: T): T;
    setState<T>(key: string, value: T): void;
    getTemp<T>(key: string, defaultValue: T): T;
    setTemp<T>(key: string, value: T): void;
    readonly modalActive: boolean;
    setModalActive(valOrFn: ((oldVal: boolean) => boolean) | boolean): void;
    defaultColorScheme: 'light' | 'dark';
}
declare const LayoutContext: React.Context<ILayoutContext>;
export declare function LayoutStateProvider({ children, }: {
    children?: React.ReactNode;
}): JSX.Element;
export default LayoutContext;
