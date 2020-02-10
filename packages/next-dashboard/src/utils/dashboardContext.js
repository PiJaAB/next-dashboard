// @flow
import React, { useState, useMemo, type Context } from 'react';

import type {
  Branding,
  DashboardComponent,
  IAuthProvider,
  SiteMessageType,
  Theme,
} from './types';
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

  +branding: Branding,
  +Comp: DashboardComponent<any>,
  +themes: $ReadOnlyArray<Theme>,

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

  branding: { name: 'UNINITIALIZED' },
  Comp: () => null,
  themes: [{ name: 'Default', class: 'default' }],

  isAuthenticated: () => false,
  getAuthProvider: () => {},
};

type DashboardState = {
  theme: string,
};

function buildContext(
  initialLayoutState: LayoutState,
  persistLayout: LayoutState => void,
  getState: <T>(key: string, defaultValue: T) => T,
  setState: <T>(key: string, value: T) => void,
  themes: $ReadOnlyArray<Theme>,
  siteMessages: $ReadOnlyArray<SiteMessageType>,
  registerSiteMessage: (siteMessages: Error | SiteMessageType) => void,
  dismissSiteMessage: (siteMessages: SiteMessageType) => void,
  branding: Branding,
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

    branding,
    Comp,
    themes,

    getAuthProvider,
    isAuthenticated,
  };
}

export function useCreateDashboardContext(
  initialDashboardState: DashboardState,
  initialLayoutState: LayoutState,
  persistDashboard: DashboardState => void,
  persistLayout: LayoutState => void,
  themes: $ReadOnlyArray<Theme>,
  siteMessages: $ReadOnlyArray<SiteMessageType>,
  registerSiteMessage: (siteMessages: Error | SiteMessageType) => void,
  dismissSiteMessage: (siteMessages: SiteMessageType) => void,
  branding: Branding,
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
    const authProvider = new AuthProvider(authSerialized);
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
    themes,
    siteMessages,
    registerSiteMessage,
    dismissSiteMessage,
    branding,
    Comp,
    getAuthProvider,
    isAuthenticated,
  ];
  const context = useMemo(() => buildContext(...inputs), inputs);

  return context;
}

// Making a bitmask... bitwise operators are kinda useful :3
/* eslint-disable no-bitwise */
const flags = [
  'STATE',
  'SITEMESSAGE',
  'BRANDING',
  'COMPONENT',
  'THEMES',
  'AUTHPROVIDER',
];
const makeBitMask = () => {
  const mask = {};
  for (let i = 0; i < flags.length; i++) {
    mask[flags[i]] = 1 << i;
  }
  return mask;
};
const bitmasks = { ...makeBitMask() };

type Bitmasks = typeof bitmasks;

type ExtendedContext = {
  ...Context<IDashboardContext>,
  ...Bitmasks,
};

const DashboardContext: $Shape<ExtendedContext> = React.createContext<IDashboardContext>(
  defaultContext,
  (oldCtx, newCtx) => {
    let changedBits = 0;
    if (
      oldCtx.setState !== newCtx.setState ||
      oldCtx.getState !== newCtx.getState
    ) {
      changedBits |= bitmasks.STATE;
    }
    if (
      oldCtx.siteMessages !== newCtx.siteMessages ||
      oldCtx.registerSiteMessage !== newCtx.registerSiteMessage ||
      oldCtx.dismissSiteMessage !== newCtx.dismissSiteMessage
    ) {
      changedBits |= bitmasks.SITEMESSAGE;
    }
    if (oldCtx.branding !== newCtx.branding) {
      changedBits |= bitmasks.BRANDING;
    }
    if (oldCtx.Comp !== newCtx.Comp) {
      changedBits |= bitmasks.COMPONENT;
    }
    if (oldCtx.themes !== newCtx.themes) {
      changedBits |= bitmasks.THEMES;
    }
    if (
      oldCtx.getAuthProvider !== newCtx.getAuthProvider ||
      oldCtx.isAuthenticated !== newCtx.isAuthenticated
    ) {
      changedBits |= bitmasks.AUTHPROVIDER;
    }

    return changedBits;
  },
);
/* eslint-enable no-bitwise */
for (let i = 0; i < flags.length; i++) {
  DashboardContext[flags[i]] = bitmasks[flags[i]];
}
DashboardContext.displayName = 'DashboardContext';
export default (DashboardContext: Context<IDashboardContext> & Bitmasks);
