// @flow
import React from 'react';
import type { Theme, SiteMessageType } from './types';

export interface IDashboardContext {
  getState<T>(key: string, defaultValue: T): T;
  setState: <T>(key: string, value: T) => void;
  registerSiteMessage(siteMessages: Error | SiteMessageType): void;
  dismissSiteMessage(siteMessages: SiteMessageType): void;
  isAuthenticated(): boolean;
  +theme: Theme;
  +themes: $ReadOnlyArray<Theme>;
  +siteMessages: $ReadOnlyArray<SiteMessageType>;
}

export type DashboardContextType = IDashboardContext | void;

const DashboardContext = React.createContext<DashboardContextType>();
DashboardContext.displayName = 'DashboardContext';
export default DashboardContext;
