// @flow
import React, { useState, useMemo } from 'react';

import type { Theme } from './types';
import type { IDashboardContext } from './dashboardContext';

const DEFAULT_THEME: Theme = { name: 'Default', class: 'default' };

export interface ILayoutContext {
  getState<T>(key: string, defaultValue: T): T;
  setState<T>(key: string, value: T): void;
  getTemp<T>(key: string, defaultValue: T): T;
  setTemp<T>(key: string, value: T): void;
  +theme: Theme;
  +themes: $ReadOnlyArray<Theme>;
  +modalActive: boolean;
  setModalActive((boolean => boolean) | boolean): void;
}

const defaultContext: ILayoutContext = {
  getState<T>(_: string, defaultValue: T): T {
    return defaultValue;
  },
  setState: (_, __) => {},
  getTemp<T>(_: string, defaultValue: T): T {
    return defaultValue;
  },
  setTemp: (_, __) => {},
  theme: DEFAULT_THEME,
  themes: [DEFAULT_THEME],
  modalActive: false,
  setModalActive: () => {},
};

export type LayoutState = {
  theme: Theme,
};

function buildContext(
  getState: <T>(key: string, defaultValue: T) => T,
  setState: <T>(key: string, value: T) => void,
  getTemp: <T>(key: string, defaultValue: T) => T,
  setTemp: <T>(key: string, value: T) => void,
  modalActive: boolean,
  setModalActive: ((boolean => boolean) | boolean) => void,
  persist: LayoutState => void,
  themes: $ReadOnlyArray<Theme>,
  tempVars: { +[string]: any },
): ILayoutContext {
  const theme: Theme =
    themes.find(t => t.class === getState('theme', DEFAULT_THEME).class) ||
    themes[0] ||
    DEFAULT_THEME;
  return {
    getState,
    setState,
    getTemp,
    setTemp,
    theme,
    themes,
    modalActive,
    setModalActive,
    tempVars,
  };
}

export function useCreateLayoutContext(
  initialState: LayoutState,
  persist: LayoutState => void,
  ctx: IDashboardContext,
): ILayoutContext {
  const [persistentState, setPersistentState] = useState(initialState);
  const [getState, setState] = useMemo(() => {
    function set<T>(key: string, value: T) {
      const newState: LayoutState = {
        ...persistentState,
        [key]: value,
      };
      setPersistentState(newState);
      persist(newState);
    }
    function get<T>(key: string, defaultValue: T): T {
      if (typeof persistentState[key] !== 'undefined')
        return persistentState[key];
      return defaultValue;
    }
    return [get, set];
  }, [persistentState, setPersistentState, persist]);

  const [tempState, setTempState] = useState<{ +[string]: any }>({});
  const [getTemp, setTemp] = useMemo(() => {
    function set<T>(key: string, value: T) {
      setTempState((oldState: LayoutState) => {
        if (oldState[key] === value) return oldState;
        const newState: LayoutState = {
          ...oldState,
          [key]: value,
        };
        return newState;
      });
    }
    function get<T>(key: string, defaultValue: T): T {
      if (typeof tempState[key] !== 'undefined') return tempState[key];
      return defaultValue;
    }
    return [get, set];
  }, [tempState, setTempState]);

  const [modalActive, setModalActive] = useState(false);

  const inputs = [
    getState,
    setState,
    getTemp,
    setTemp,
    modalActive,
    setModalActive,
    persist,
    ctx.themes,
    tempState,
  ];

  const context = useMemo(() => buildContext(...inputs), inputs);

  return context;
}

const LayoutContext = React.createContext<ILayoutContext>(defaultContext);

LayoutContext.displayName = 'LayoutContext';
export default LayoutContext;
