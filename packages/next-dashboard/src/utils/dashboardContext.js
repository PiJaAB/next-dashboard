// @flow
import React from 'react';
import type { MappedData, Theme, SiteMessageType } from './types';
import PollingProvider from '../dataProviders/PollingProvider';

export interface IDashboardContext<Data: {}, DP: PollingProvider<Data>> {
  dataProvider: DP;
  getState<T>(key: string, defaultValue: T): T;
  setState: <T>(key: string, value: T) => void;
  +data: MappedData<Data>;
  registerSiteMessage(siteMessages: Error | SiteMessageType): void;
  dismissSiteMessage(siteMessages: SiteMessageType): void;
  +theme: Theme;
  +themes: $ReadOnlyArray<Theme>;
  +siteMessages: $ReadOnlyArray<SiteMessageType>;
}

export type DashboardContextType<Data: {} = any> = IDashboardContext<
  Data,
  PollingProvider<Data>,
> | void;

const DashboardContext = React.createContext<DashboardContextType<>>();
DashboardContext.displayName = 'DashboardContext';
export default DashboardContext;
