// @flow
import React, { useState, useEffect, type Context } from 'react';

import type { Theme } from './types';
import type { IDashboardContext } from './dashboardContext';

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
  theme: { name: 'Default', class: 'default' },
  themes: [{ name: 'Default', class: 'default' }],
  modalActive: false,
  setModalActive: () => {},
};

export type LayoutState = {
  theme: string,
};

function buildContext(
  usePersistentState: [
    LayoutState,
    ((LayoutState => LayoutState) | LayoutState) => void,
  ],
  useModalActive: [boolean, ((boolean => boolean) | boolean) => void],
  persist: LayoutState => void,
  ctx: IDashboardContext,
): ILayoutContext {
  const [persistentState, setPersistentState] = usePersistentState;
  const [modalActive, setModalActive] = useModalActive;
  function getState<T>(key: string, defaultValue: T): T {
    if (typeof persistentState[key] !== 'undefined')
      return persistentState[key];
    return defaultValue;
  }
  function setState<T>(key: string, value: T) {
    const newState: LayoutState = {
      ...persistentState,
      [key]: value,
    };
    setPersistentState(newState);
    persist(newState);
  }

  const { themes } = ctx;

  const theme: Theme = themes.find(t => t.class === persistentState.theme) ||
    themes[0] || { name: 'Default', class: 'default' };
  return {
    getState,
    setState,
    theme,
    themes,
    modalActive,
    setModalActive,
  };
}

export function useNewLayoutContext(
  initialState: LayoutState,
  persist: LayoutState => void,
  ctx: IDashboardContext,
): ILayoutContext {
  const usePersistentState = useState(initialState);
  const useModalActive = useState(false);
  const [context, setContext] = useState(() =>
    buildContext(usePersistentState, useModalActive, persist, ctx),
  );

  useEffect(() => {
    setContext(buildContext(usePersistentState, useModalActive, persist, ctx));
  }, [...usePersistentState, ...useModalActive, persist, ctx.themes]);

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
