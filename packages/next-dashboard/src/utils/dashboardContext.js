// @flow
import React from 'react';

import type {
  Branding,
  DashboardComponent,
  // eslint fails to parse `getAuthProvider<T: IAuthProvider>`
  // as this type being used...
  // eslint-disable-next-line no-unused-vars
  IAuthProvider,
  SiteMessageType,
  Theme,
} from './types';

export interface IDashboardContext {
  getState<T>(key: string, defaultValue: T): T;
  setState: <T>(key: string, value: T) => void;
  registerSiteMessage(siteMessages: Error | SiteMessageType): void;
  dismissSiteMessage(siteMessages: SiteMessageType): void;
  isAuthenticated(): boolean | Promise<boolean>;
  +branding: Branding;
  +theme: Theme;
  +Comp: DashboardComponent<any>;
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
