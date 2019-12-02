// @flow
import React from 'react';
import type { DataType, Theme, SiteMessageType } from './types';
import AbstractProvider from '../dataProviders/AbstractProvider';

export interface IDashboardContext<DP: AbstractProvider> {
  dataProvider: DP;
  getState<T>(key: string, defaultValue: T): T;
  setState: <T>(key: string, value: T) => void;
  +data: { +[string]: DataType };
  registerSiteMessage(siteMessages: Error | SiteMessageType): void;
  dismissSiteMessage(siteMessages: SiteMessageType): void;
  +theme: Theme;
  +themes: $ReadOnlyArray<Theme>;
  +siteMessages: $ReadOnlyArray<SiteMessageType>;
}

export type DashboardContextType = IDashboardContext<AbstractProvider> | void;

const DashboardContext = React.createContext<DashboardContextType>();
DashboardContext.displayName = 'DashboardContext';
export default DashboardContext;
