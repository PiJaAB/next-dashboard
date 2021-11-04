import React, { useState, useMemo, useCallback, useEffect } from 'react';

import type { DashboardComponent, SiteMessageType } from './types';

import logger from './logger';
import { LayoutStateProvider } from './layoutContext';
import { SilentError } from './silentError';
import { errorEventEmitter } from './errorReporter';

export interface IDashboardContext {
  getState: <T>(key: string, defaultValue: T) => T;
  setState: <T>(key: string, value: T) => void;

  readonly siteMessages: readonly SiteMessageType[];
  registerSiteMessage(siteMessages: Error | SiteMessageType): void;
  dismissSiteMessage(siteMessages: SiteMessageType): void;

  readonly Comp: DashboardComponent<any>;
}

const defaultContext: IDashboardContext = {
  getState<T>(_: string, defaultValue: T): T {
    return defaultValue;
  },
  setState: (_, __) => {},

  siteMessages: [],
  registerSiteMessage() {},
  dismissSiteMessage() {},

  Comp: () => null,
};

const DashboardContext = React.createContext<IDashboardContext>(defaultContext);

DashboardContext.displayName = 'DashboardContext';

let persistTimeout: number | null = null;

function compareSitemessages(
  m1: SiteMessageType,
  m2: SiteMessageType,
): boolean {
  if (m1.status !== m2.status) return false;
  if (m1.title !== m2.title) return false;
  if (m1.message !== m2.message) return false;
  return true;
}

export function DashboardProvider({
  children,
}: {
  children: React.ReactElement<any, DashboardComponent<any>>;
}): JSX.Element {
  const [persistentState, setPersistentState] = useState<Record<string, any>>(
    {},
  );
  const persist = useCallback(() => {
    if (persistTimeout != null) return;
    persistTimeout = window.setTimeout(() => {
      persistTimeout = null;
      setPersistentState((state) => {
        window.localStorage.setItem(
          'dashboard-layout-state',
          JSON.stringify(state),
        );
        return state;
      });
    }, 100);
  }, [setPersistentState]);
  useEffect(() => {
    if (typeof window === undefined) return undefined;
    const refresh = () => {
      const storageString = window.localStorage.getItem(
        'dashboard-layout-state',
      );
      if (!storageString) return;
      try {
        const obj = JSON.parse(storageString) as unknown;
        if (typeof obj !== 'object') {
          throw new Error('Preferences not a valid value');
        }
        if (obj == null || Array.isArray(obj)) {
          throw new Error('Preferences not a valid value');
        }
        setPersistentState(obj);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };
    refresh();
    const storageListener = ({ key }: StorageEvent) => {
      if (key === 'dashboard-layout-state') {
        refresh();
      }
    };
    window.addEventListener('storage', storageListener, {
      passive: true,
    });
    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, [setPersistentState]);
  const getState = useCallback<<T>(key: string, defaultValue: T) => T>(
    (key, defaultValue) => {
      const val = persistentState[key];
      if (val == null) return defaultValue;
      return val;
    },
    [persistentState],
  );
  const setState = useCallback<<T>(key: string, value: T) => void>(
    (key, val) => {
      setPersistentState((state) => {
        if (state[key] === val) return state;
        persist();
        return {
          ...state,
          [key]: val,
        };
      });
    },
    [persist, setPersistentState],
  );
  const Comp = children.type;
  const [siteMessages, setSiteMessages] = useState<readonly SiteMessageType[]>(
    [],
  );
  const [registerSiteMessage, dismissSiteMessage] = useMemo(() => {
    let innerSiteMessages: readonly SiteMessageType[] = [];
    setSiteMessages(innerSiteMessages);
    const registerSiteMessageInner = (siteMessage: SiteMessageType | Error) => {
      if (siteMessage instanceof Error) {
        if (siteMessage instanceof SilentError) return;
        logger.error(siteMessage);
        registerSiteMessageInner({
          title: siteMessage.constructor.name,
          status: 'error',
          message: siteMessage.message,
        });
        return;
      }
      function siteMessageAdder(
        curSiteMessages: readonly SiteMessageType[],
      ): readonly SiteMessageType[] {
        const existingIndex = curSiteMessages.findIndex((m) =>
          compareSitemessages(m, siteMessage),
        );
        let newSiteMessages: SiteMessageType[];
        if (existingIndex > -1) {
          newSiteMessages = [...curSiteMessages];
          const updatedMessage = {
            ...curSiteMessages[existingIndex],
          };
          updatedMessage.count =
            (updatedMessage?.count != null ? updatedMessage.count : 1) + 1;
          newSiteMessages[existingIndex] = updatedMessage;
        } else {
          newSiteMessages = [...curSiteMessages, siteMessage];
        }
        innerSiteMessages = newSiteMessages;
        return newSiteMessages;
      }

      setSiteMessages(siteMessageAdder);
    };
    function dismissSiteMessageInner(siteMessage: SiteMessageType) {
      const siteMessageDismisser = (
        curSiteMessages: readonly SiteMessageType[],
      ): readonly SiteMessageType[] => {
        const newMessages = curSiteMessages.filter(
          (m) => !compareSitemessages(m, siteMessage),
        );
        innerSiteMessages = newMessages;
        return newMessages;
      };
      setSiteMessages(siteMessageDismisser);
    }
    return [registerSiteMessageInner, dismissSiteMessageInner];
  }, [setSiteMessages]);
  useEffect(() => {
    function onError(err: Error) {
      registerSiteMessage(err);
    }
    function onReport(msg: SiteMessageType) {
      registerSiteMessage(msg);
    }
    errorEventEmitter.on('report', onReport);
    errorEventEmitter.on('error', onError);
    return () => {
      errorEventEmitter.off('report', onReport);
      errorEventEmitter.off('error', onError);
    };
  }, [registerSiteMessage]);
  const ctx: IDashboardContext = useMemo(
    () => ({
      getState,
      setState,
      siteMessages,
      registerSiteMessage,
      dismissSiteMessage,
      Comp,
    }),
    [
      Comp,
      dismissSiteMessage,
      getState,
      registerSiteMessage,
      setState,
      siteMessages,
    ],
  );
  return (
    <DashboardContext.Provider value={ctx}>
      <LayoutStateProvider>{children}</LayoutStateProvider>
    </DashboardContext.Provider>
  );
}

export default DashboardContext;
