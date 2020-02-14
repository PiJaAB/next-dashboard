// @flow
import React, { useState, useMemo } from 'react';

import type {
  DashboardComponent,
  IAuthProvider,
  SiteMessageType,
} from './types';
import type { InitialPropsContext } from './nextTypes';

import logger from './logger';
import type { LayoutState } from './layoutContext';

export const LAYOUT = Symbol('Layout');

export type IDashboardContext = {
  [Symbol]: {
    initialState: LayoutState,
    persist: LayoutState => void,
  },
  getState: <T>(key: string, defaultValue: T) => T,
  setState: <T>(key: string, value: T) => void,

  +siteMessages: $ReadOnlyArray<SiteMessageType>,
  registerSiteMessage(siteMessages: Error | SiteMessageType): void,
  dismissSiteMessage(siteMessages: SiteMessageType): void,

  +Comp: DashboardComponent<any>,

  isAuthenticated(): boolean | Promise<boolean>,
  getAuthProvider<T: IAuthProvider>(Class: Class<T>): T | void,
};

const defaultContext: IDashboardContext = {
  // $FlowIssue: Symbols not supported
  [LAYOUT]: {
    initialState: { theme: { name: 'Default', class: 'default' } },
    persist: () => {},
  },

  getState<T>(_: string, defaultValue: T): T {
    return defaultValue;
  },
  setState: (_, __) => {},

  siteMessages: [],
  registerSiteMessage() {},
  dismissSiteMessage() {},

  Comp: () => null,

  isAuthenticated: () => false,
  getAuthProvider: () => {},
};

const isSSR = typeof window === 'undefined';
let SINGLETON_AUTH_PROVIDER = null;
export function getAuthProviderInstance(
  AuthProvider: Class<IAuthProvider>,
  ctx: InitialPropsContext | string,
): IAuthProvider {
  if (SINGLETON_AUTH_PROVIDER instanceof AuthProvider) {
    return SINGLETON_AUTH_PROVIDER;
  }
  const instance = new AuthProvider(ctx);
  if (!isSSR) SINGLETON_AUTH_PROVIDER = instance;
  return instance;
}

type DashboardState = {
  theme: string,
};

function buildContext(
  initialLayoutState: LayoutState,
  persistLayout: LayoutState => void,
  getState: <T>(key: string, defaultValue: T) => T,
  setState: <T>(key: string, value: T) => void,
  siteMessages: $ReadOnlyArray<SiteMessageType>,
  registerSiteMessage: (siteMessages: Error | SiteMessageType) => void,
  dismissSiteMessage: (siteMessages: SiteMessageType) => void,
  Comp: DashboardComponent<any>,
  getAuthProvider: <T: IAuthProvider>(Class: Class<T>) => T | void,
  isAuthenticated: () => boolean | Promise<boolean>,
): IDashboardContext {
  return {
    // $FlowIssue: Symbols not supported
    [LAYOUT]: {
      initialState: initialLayoutState,
      persist: persistLayout,
    },
    getState,
    setState,

    siteMessages,
    registerSiteMessage,
    dismissSiteMessage,

    Comp,

    getAuthProvider,
    isAuthenticated,
  };
}

export function useCreateDashboardContext(
  initialDashboardState: DashboardState,
  initialLayoutState: LayoutState,
  persistDashboard: DashboardState => void,
  persistLayout: LayoutState => void,
  siteMessages: $ReadOnlyArray<SiteMessageType>,
  registerSiteMessage: (siteMessages: Error | SiteMessageType) => void,
  dismissSiteMessage: (siteMessages: SiteMessageType) => void,
  Comp: DashboardComponent<any>,
  authSerialized: string,
  AuthProvider: Class<IAuthProvider>,
): IDashboardContext {
  const [persistentState, setPersistentState] = useState(initialDashboardState);
  const [getState, setState] = useMemo(() => {
    function set<T>(key: string, value: T) {
      const newState: DashboardState = {
        ...persistentState,
        [key]: value,
      };
      setPersistentState(newState);
      persistDashboard(newState);
    }
    function get<T>(key: string, defaultValue: T): T {
      if (typeof persistentState[key] !== 'undefined')
        return persistentState[key];
      return defaultValue;
    }
    return [get, set];
  }, [persistentState, setPersistentState, persistDashboard]);

  const [getAuthProvider, isAuthenticated] = useMemo(() => {
    const authProvider = getAuthProviderInstance(AuthProvider, authSerialized);
    function getAP<A: IAuthProvider>(C: Class<A>): A | void {
      if (authProvider === undefined) return undefined;
      if (authProvider instanceof C) return authProvider;
      logger.error(
        new Error('AuthProvider mismatch, instance not of requested class'),
      );
      return undefined;
    }

    const isAuth = () => authProvider.isAuthenticated();
    return [getAP, isAuth];
  }, [AuthProvider, authSerialized]);

  const inputs = [
    initialLayoutState,
    persistLayout,
    getState,
    setState,
    siteMessages,
    registerSiteMessage,
    dismissSiteMessage,
    Comp,
    getAuthProvider,
    isAuthenticated,
  ];
  const context = useMemo(() => buildContext(...inputs), inputs);

  return context;
}

const DashboardContext = React.createContext<IDashboardContext>(defaultContext);

DashboardContext.displayName = 'DashboardContext';
export default DashboardContext;
