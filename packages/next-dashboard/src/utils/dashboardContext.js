// @flow
import React from 'react';
import type { DataProvider, DataType, Theme, SiteMessageType } from './types';

export type DashboardContextType = {
  ...DataProvider,
  getState<T>(key: string, defaultValue: T): T,
  setState: <T>(key: string, value: T) => void,
  data: { [string]: DataType },
  registerError(err: Error): void,
  theme: Theme,
  themes: Theme[],
  siteMessages: SiteMessageType[],
};

const DashboardContext = React.createContext<DashboardContextType | void>();
DashboardContext.displayName = 'DashboardContext';
export default DashboardContext;
