import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react';

import { Theme } from './types';
import configContext from './configContext';

const DEFAULT_THEME: Theme = { name: 'Default', class: 'default' };

export interface ILayoutContext {
  getState<T>(key: string, defaultValue: T): T;
  setState<T>(key: string, value: T): void;
  getTemp<T>(key: string, defaultValue: T): T;
  setTemp<T>(key: string, value: T): void;
  readonly theme: Theme;
  readonly themes: readonly Theme[];
  readonly modalActive: boolean;
  setModalActive(valOrFn: ((oldVal: boolean) => boolean) | boolean): void;
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
  theme: Theme;
};

const LayoutContext = React.createContext<ILayoutContext>(defaultContext);

LayoutContext.displayName = 'LayoutContext';

let persistTimeout: number | null = null;

export function LayoutStateProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const configCtx = useContext(configContext);
  const [persistentState, setPersistentState] = useState<Record<string, any>>(
    {},
  );
  const [tempState, setTempState] = useState<Record<string, any>>({});
  const [modalActive, setModalActive] = useState(false);
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
  const getTemp = useCallback<<T>(key: string, defaultValue: T) => T>(
    (key, defaultValue) => {
      const val = tempState[key];
      if (val == null) return defaultValue;
      return val;
    },
    [tempState],
  );
  const setTemp = useCallback<<T>(key: string, value: T) => void>(
    (key, val) => {
      setTempState((state) => {
        if (state[key] === val) return state;
        return {
          ...state,
          [key]: val,
        };
      });
    },
    [setTempState],
  );
  const ctx = useMemo(
    () => ({
      getState,
      setState,
      getTemp,
      setTemp,
      theme:
        configCtx.themes.find(
          (t: Theme) => t.class === getState('theme', DEFAULT_THEME).class,
        ) ||
        configCtx.themes[0] ||
        DEFAULT_THEME,
      themes: configCtx.themes,
      modalActive,
      setModalActive,
    }),
    [configCtx.themes, getState, getTemp, modalActive, setState, setTemp],
  );
  return (
    <LayoutContext.Provider value={ctx}>{children}</LayoutContext.Provider>
  );
}

export default LayoutContext;
