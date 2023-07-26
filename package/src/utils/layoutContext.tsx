import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
  useRef,
  SetStateAction,
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

export interface BaseTempState {
  sidebarOpen: boolean;
  hasHeader: boolean;
}

export interface TempState extends BaseTempState {
  [key: string]: any;
}

const defaultTempState: BaseTempState = {
  sidebarOpen: false,
  hasHeader: true,
};

interface TempStateDispatch {
  <V extends TempState[K], K extends keyof TempState = keyof TempState>(
    key: K,
    value: SetStateAction<V>,
  ): void;
}

interface TempStateGetter {
  <V extends TempState[K], K extends keyof TempState = keyof TempState>(
    key: K,
    defaultValue: V,
  ): V;
  <V extends TempState[K], K extends keyof TempState = keyof TempState>(
    key: K,
    defaultValue?: V,
  ): TempState[K] extends undefined ? V | undefined : V;
}

export interface BasePersistentState {
  compactSidebar: boolean;
  colorScheme: 'light' | 'dark';
}

export interface PersistentState extends BasePersistentState {
  [key: string]: any;
}

const defaultPersistentState: Omit<BasePersistentState, 'colorScheme'> = {
  compactSidebar: false,
};

interface PersistentStateDispatch {
  <
    V extends PersistentState[K],
    K extends keyof PersistentState = keyof PersistentState,
  >(
    key: K,
    value: SetStateAction<V>,
  ): void;
}

interface PersistentStateGetter {
  <
    V extends PersistentState[K],
    K extends keyof PersistentState = keyof PersistentState,
  >(
    key: K,
    defaultValue: V,
  ): V;
  <
    V extends PersistentState[K],
    K extends keyof PersistentState = keyof PersistentState,
  >(
    key: K,
    defaultValue?: V,
  ): PersistentState[K] extends undefined ? V | undefined : V;
}

const colorSchemeQuery =
  typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

function autoDetectTheme() {
  if (colorSchemeQuery == null) {
    return undefined;
  }
  return colorSchemeQuery.matches ? 'dark' : 'light';
}

function getDefaultColorScheme(config: FullConfig): 'light' | 'dark' {
  if (config.autoDetectTheme) {
    return autoDetectTheme() ?? config.defaultTheme;
  }
  return config.defaultTheme;
}

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
    if (colorSchemeQuery == null) {
      return undefined;
    }
    const detected = autoDetectTheme();
    if (detected != null) setDefaultColorScheme(detected);
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

  const [persistentState, setPersistentState] = useState(
    (): PersistentState => ({
      ...defaultPersistentState,
      colorScheme: getDefaultColorScheme(configCtx),
    }),
  );
  const [tempState, setTempState] = useState<TempState>(
    (): TempState => ({
      ...defaultTempState,
    }),
  );
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
  }, []);
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
        setPersistentState(obj as PersistentState);
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
  }, []);
  const getState = useCallback<PersistentStateGetter>(
    (key, defaultValue) => {
      const val = persistentState[key];
      if (val == null) return defaultValue;
      return val;
    },
    [persistentState],
  );
  const setState = useCallback<PersistentStateDispatch>(
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
    [persist],
  );
  const getTemp = useCallback<TempStateGetter>(
    (key, defaultValue) => {
      const val = tempState[key];
      if (val == null) return defaultValue;
      return val;
    },
    [tempState],
  );
  const setTemp = useCallback<TempStateDispatch>((key, val) => {
    setTempState((state) => {
      if (state[key] === val) return state;
      return {
        ...state,
        [key]: val,
      };
    });
  }, []);
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
