// @flow
import React from 'react';

// eslint fails to parse `getAuthProvider<T: IAuthProvider>`
// as this type being used...
// eslint-disable-next-line no-unused-vars
import type { Theme, SiteMessageType, IAuthProvider } from './types';

export interface IDashboardContext {
  getState<T>(key: string, defaultValue: T): T;
  setState: <T>(key: string, value: T) => void;
  registerSiteMessage(siteMessages: Error | SiteMessageType): void;
  dismissSiteMessage(siteMessages: SiteMessageType): void;
  isAuthenticated(): boolean;
  +theme: Theme;
  +themes: $ReadOnlyArray<Theme>;
  +siteMessages: $ReadOnlyArray<SiteMessageType>;
  +modalActive: boolean;
  setModalActive((boolean => boolean) | boolean): void;
  getAuthProvider<T: IAuthProvider>(Class: Class<T>): T | void;
}

export type DashboardContextType = IDashboardContext | void;

const DashboardContext = React.createContext<DashboardContextType>();
DashboardContext.displayName = 'DashboardContext';
export default DashboardContext;
