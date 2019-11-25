// @flow
import React from 'react';
import type { DataProvider, DataType } from './types';

export type DashboardContextType = {
  ...DataProvider,
  getState<T>(key: string, defaultValue: T): T,
  setState: <T>(key: string, value: T) => void,
  data: { [string]: DataType },
};

const DashboardContext = React.createContext<DashboardContextType | void>();
DashboardContext.displayName = 'DashboardContext';
export default DashboardContext;
