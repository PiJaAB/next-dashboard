// @flow
import React, { useState, useEffect, type Context } from 'react';

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

function usePersistentState(
  initialState: DashboardState,
  persist: DashboardState => void,
): [
  <T>(key: string, defaultValue: T) => T,
  <T>(key: string, value: T) => void,
] {
  const [persistentState, setPersistentState] = useState(initialState);
  const [getState, setGetState] = useState(
    () => /*::<T>*/ (key: string, defaultValue: T) => {
      if (typeof persistentState[key] !== 'undefined')
        return persistentState[key];
      return defaultValue;
    },
  );
  const [setState, setSetState] = useState(
    () => /*::<T>*/ (key: string, value: T) => {
      const newState: DashboardState = {
        ...persistentState,
        [key]: value,
      };
      setPersistentState(newState);
      persist(newState);
    },
  );

  useEffect(() => {
    setGetState(() => /*::<T>*/ (key: string, defaultValue: T) => {
      if (typeof persistentState[key] !== 'undefined')
        return persistentState[key];
      return defaultValue;
    });
  }, [persistentState]);

  useEffect(() => {
    setSetState(() => /*::<T>*/ (key: string, value: T) => {
      const newState: DashboardState = {
        ...persistentState,
        [key]: value,
      };
      setPersistentState(newState);
      persist(newState);
    });
  }, [persistentState, setPersistentState, persist]);

  return [getState, setState];
}

const useAuthProvider = (
  AuthProvider: Class<IAuthProvider>,
  authSerialized: string,
) => {
  const [authProvider, setAuthProvider] = useState<IAuthProvider>(
    () => new AuthProvider(authSerialized),
  );
  const [getAuthProvider, setGetAuthProvider] = useState(
    () => <A: IAuthProvider>(C: Class<A>): A | void => {
      if (authProvider === undefined) return undefined;
      if (authProvider instanceof C) return authProvider;
      logger.error(
        new Error('AuthProvider mismatch, instance not of requested class'),
      );
      return undefined;
    },
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() => () =>
    authProvider.isAuthenticated(),
  );

  useEffect(() => {
    if (
      authProvider.serialize() === authSerialized &&
      authProvider instanceof AuthProvider
    ) {
      return;
    }
    setAuthProvider(new AuthProvider(authSerialized));
  }, [AuthProvider, authSerialized]);

  useEffect(() => {
    setGetAuthProvider(() => <A: IAuthProvider>(C: Class<A>): A | void => {
      if (authProvider === undefined) return undefined;
      if (authProvider instanceof C) return authProvider;
      logger.error(
        new Error('AuthProvider mismatch, instance not of requested class'),
      );
      return undefined;
    });
    setIsAuthenticated(() => () => authProvider.isAuthenticated());
  }, [authProvider]);

  return [getAuthProvider, isAuthenticated];
};

export function useNewDashboardContext(
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
  const [getState, setState] = usePersistentState(
    initialDashboardState,
    persistDashboard,
  );
  const [getAuthProvider, isAuthenticated] = useAuthProvider(
    AuthProvider,
    authSerialized,
  );
  const [context, setContext] = useState(() =>
    buildContext(
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
    ),
  );

  useEffect(() => {
    setContext(
      buildContext(
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
      ),
    );
  }, [
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
  ]);

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
