// @flow

import type { DataProvider } from './types';

type PublicContext = {
  setState<T>(key: string, value: T): void,
  getState<T>(key: string, defaultValue: T): T,
};

type InternalContext = {
  // eslint-disable-next-line flowtype/no-weak-types
  stateData: { [string]: any },
};

export type DashboardContext<D> = D & PublicContext;

type FullContext<D> = DashboardContext<D> & InternalContext;

function getInitialState(): $PropertyType<InternalContext, 'stateData'> {
  const storage = typeof window !== 'undefined' && window.localStorage;
  if (!storage) return {};
  let initialState;
  try {
    initialState = JSON.parse(storage.getItem('dashboardState'));
    if (
      (initialState == null || typeof initialState !== 'object') &&
      !Array.isArray(initialState)
    )
      initialState = {};
  } catch {
    initialState = {};
  }
  return initialState;
}

export default function createDashboardContext<D: DataProvider>(
  dataProvider: D,
): DashboardContext<D> {
  const initialState = getInitialState();
  let persistContext = null;

  function persist(context: FullContext<D>) {
    if (typeof window === 'undefined' || !window.setTimeout) return;
    if (!persistContext) {
      window.setTimeout(() => {
        const curContext = persistContext;
        persistContext = null;
        if (!curContext) return;
        try {
          window.storage.setItem(
            'dashboardState',
            JSON.stringify(curContext.stateData),
          );
        } catch (err) {
          console.error(err);
        }
      }, 500);
    }
    persistContext = context;
  }

  const context: FullContext<D> = {
    ...dataProvider,
    setState<T>(key: string, value: T) {
      if (context.stateData[key] === value) return;
      context.stateData = {
        ...context.stateData,
        [key]: value,
      };
      persist(context);
    },
    getState<T>(key: string, defaultValue: T): T {
      if (key in context.stateData) return context.stateData[key];
      return defaultValue;
    },
    stateData: initialState,
  };

  return context;
}
