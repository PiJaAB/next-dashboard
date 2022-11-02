import React from 'react';
import type { DashboardComponent, SiteMessageType } from './types';
export interface IDashboardContext {
    getState: <T>(key: string, defaultValue: T) => T;
    setState: <T>(key: string, value: T) => void;
    readonly siteMessages: readonly SiteMessageType[];
    registerSiteMessage(siteMessages: Error | SiteMessageType): void;
    dismissSiteMessage(siteMessages: SiteMessageType): void;
    readonly Comp: DashboardComponent<any>;
}
declare const DashboardContext: React.Context<IDashboardContext>;
export declare function DashboardProvider({ children, }: {
    children: React.ReactElement<any, DashboardComponent<any>>;
}): JSX.Element;
export default DashboardContext;
