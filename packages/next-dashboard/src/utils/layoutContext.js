// @flow
import React, { useState, useMemo, type Context } from 'react';

import type { Theme } from './types';
import type { IDashboardContext } from './dashboardContext';

const DEFAULT_THEME: Theme = { name: 'Default', class: 'default' };

export interface ILayoutContext {
  getState<T>(key: string, defaultValue: T): T;
  setState<T>(key: string, value: T): void;
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
  theme: DEFAULT_THEME,
  themes: [DEFAULT_THEME],
  modalActive: false,
  setModalActive: () => {},
};

export type LayoutState = {
  theme: string,
};

function buildContext(
  getState: <T>(key: string, defaultValue: T) => T,
  setState: <T>(key: string, value: T) => void,
  modalActive: boolean,
  setModalActive: ((boolean => boolean) | boolean) => void,
  persist: LayoutState => void,
  themes: $ReadOnlyArray<Theme>,
): ILayoutContext {
  const theme: Theme =
    themes.find(t => t.class === getState('theme', DEFAULT_THEME).class) ||
    themes[0] ||
    DEFAULT_THEME;
  return {
    getState,
    setState,
    theme,
    themes,
    modalActive,
    setModalActive,
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
  const [modalActive, setModalActive] = useState(false);

  const inputs = [
    getState,
    setState,
    modalActive,
    setModalActive,
    persist,
    ctx.themes,
  ];

  const context = useMemo(() => buildContext(...inputs), inputs);

  return context;
}

// Making a bitmask... bitwise operators are kinda useful :3
/* eslint-disable no-bitwise */
const flags = ['STATE', 'MODAL', 'THEME', 'THEMES'];
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
  ...Context<ILayoutContext>,
  ...Bitmasks,
};

const LayoutContext: $Shape<ExtendedContext> = React.createContext<ILayoutContext>(
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
      oldCtx.modalActive !== newCtx.modalActive ||
      oldCtx.setModalActive !== newCtx.setModalActive
    ) {
      changedBits |= bitmasks.MODAL;
    }
    if (oldCtx.theme !== newCtx.theme) {
      changedBits |= bitmasks.THEME;
    }
    if (oldCtx.themes !== newCtx.themes) {
      changedBits |= bitmasks.THEMES;
    }

    return changedBits;
  },
);
/* eslint-enable no-bitwise */
for (let i = 0; i < flags.length; i++) {
  LayoutContext[flags[i]] = bitmasks[flags[i]];
}
LayoutContext.displayName = 'LayoutContext';
export default (LayoutContext: Context<ILayoutContext> & Bitmasks);
