import React from 'react';
import { FullConfig } from './configContext';
export interface ILayoutContext {
    getState<T>(key: string, defaultValue: T): T;
    setState<T>(key: string, value: T): void;
    getTemp<T>(key: string, defaultValue: T): T;
    setTemp<T>(key: string, value: T): void;
    readonly modalActive: boolean;
    setModalActive(valOrFn: ((oldVal: boolean) => boolean) | boolean): void;
    defaultColorScheme: FullConfig['defaultTheme'];
}
declare const LayoutContext: React.Context<ILayoutContext>;
export interface BaseTempState {
    sidebarOpen: boolean;
    hasHeader: boolean;
}
export interface TempState extends BaseTempState {
    [key: string]: any;
}
export interface BasePersistentState {
    compactSidebar: boolean;
    colorScheme: 'light' | 'dark';
}
export interface PersistentState extends BasePersistentState {
    [key: string]: any;
}
export declare function LayoutStateProvider({ children, }: {
    children?: React.ReactNode;
}): JSX.Element;
export default LayoutContext;
