import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react';
import ConfigContext, { FullConfig } from './configContext';
import logger from './logger';

export interface ILayoutContext {
  getState<T>(key: string, defaultValue: T): T;
  setState<T>(key: string, value: T): void;
  getTemp<T>(key: string, defaultValue: T): T;
  setTemp<T>(key: string, value: T): void;
  readonly modalActive: boolean;
  setModalActive(valOrFn: ((oldVal: boolean) => boolean) | boolean): void;
  defaultColorScheme: FullConfig['defaultTheme'];
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
  modalActive: false,
  setModalActive: () => {},
  defaultColorScheme: 'light',
};

const LayoutContext = React.createContext<ILayoutContext>(defaultContext);

LayoutContext.displayName = 'LayoutContext';

let persistTimeout: number | null = null;

export function LayoutStateProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const configCtx = useContext(ConfigContext);
  const configCtxRef = useRef(configCtx);
  configCtxRef.current = configCtx;
  const [defaultColorScheme, setDefaultColorScheme] = useState(
    configCtx.defaultTheme,
  );
  useEffect(() => {
    if (!configCtx.autoDetectTheme) return undefined;
    const colorSchemeQuery =
      typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    if (colorSchemeQuery == null) {
      return undefined;
    }
    setDefaultColorScheme(colorSchemeQuery.matches ? 'dark' : 'light');
    const onChange = (ev: MediaQueryListEvent) => {
      setDefaultColorScheme(ev.matches ? 'dark' : 'light');
    };
    colorSchemeQuery.addEventListener('change', onChange);
    return () => {
      colorSchemeQuery.removeEventListener('change', onChange);
    };
  }, [configCtx.autoDetectTheme]);

  useEffect(() => {
    if (!configCtx.autoDetectTheme) {
      setDefaultColorScheme(configCtx.defaultTheme);
    }
  }, [configCtx.autoDetectTheme, configCtx.defaultTheme]);

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
        logger.error(err);
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
      modalActive,
      setModalActive,
      defaultColorScheme,
    }),
    [getState, getTemp, modalActive, setState, setTemp, defaultColorScheme],
  );
  return (
    <LayoutContext.Provider value={ctx}>{children}</LayoutContext.Provider>
  );
}

export default LayoutContext;
