import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type JsonType =
  | Partial<{ [key: string]: JsonType }>
  | JsonType[]
  | string
  | number
  | null;

interface PersistentContext<
  PersistentState extends Partial<Record<string, JsonType>>
> {
  getState(): PersistentState;
  setState(state: PersistentState): void;
  setState<K extends keyof PersistentState>(
    key: K,
    val: PersistentState[K],
  ): void;
}

interface UsePersistentState<
  PersistentState extends Partial<Record<string, JsonType>>
> {
  (): PersistentState;
  <K extends keyof PersistentState>(key: K): PersistentState[K];
  <K extends keyof PersistentState>(
    key: K,
    def: NonNullable<PersistentState[K]>,
  ): NonNullable<PersistentState[K]>;
}

export default function createPersistentState<
  PersistentState extends Partial<Record<string, JsonType>>
>(
  defaultState: PersistentState,
): {
  PersistentStateProvider: React.FunctionComponent<{
    name: string;
    version?: number;
  }>;
  usePersistentState: UsePersistentState<PersistentState>;
} {
  const persistentStateContext = createContext<PersistentContext<
    PersistentState
  > | null>(null);
  const persistTimeout: Partial<Record<string, number>> = {};
  function PersistentStateProvider({
    name,
    version,
    children,
  }: React.PropsWithChildren<{ name: string; version?: number }>): JSX.Element {
    const [curState, setCurState] = useState(defaultState);
    const persist = useCallback(() => {
      if (persistTimeout[name] != null) return;
      persistTimeout[name] = window.setTimeout(() => {
        delete persistTimeout[name];
        setCurState(state => {
          window.localStorage.setItem(
            name,
            JSON.stringify({
              version,
              state,
            }),
          );
          return state;
        });
      });
    }, [name, version, setCurState]);
    useEffect(() => {
      if (typeof window === undefined) return undefined;
      const refresh = () => {
        const storageString = window.localStorage.getItem(name);
        if (!storageString) return;
        try {
          const obj = JSON.parse(storageString) as unknown;
          if (typeof obj !== 'object') {
            throw new Error('Preferences not a valid value');
          }
          if (obj == null || Array.isArray(obj)) {
            throw new Error('Preferences not a valid value');
          }
          if (
            version != null &&
            (obj as { version?: unknown }).version !== version
          ) {
            throw new Error('State version mismatch');
          }
          setCurState((obj as { state: PersistentState }).state);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      };
      refresh();
      const storageListener = ({ key }: StorageEvent) => {
        if (key === name) {
          refresh();
        }
      };
      window.addEventListener('storage', storageListener, {
        passive: true,
      });
      return () => {
        window.removeEventListener('storage', storageListener);
      };
    }, [name, version, setCurState]);
    const getState = useCallback(() => {
      return curState;
    }, [curState]);
    const setState = useCallback<
      PersistentContext<PersistentState>['setState']
    >(
      (
        keyOrState: keyof PersistentState | PersistentState,
        val?: PersistentState[keyof PersistentState],
      ) => {
        if (typeof keyOrState === 'object') {
          persist();
          setCurState(keyOrState);
        } else {
          setCurState(state => {
            if (state[keyOrState] === val) return state;
            persist();
            return {
              ...state,
              [keyOrState]: val,
            };
          });
        }
      },
      [setCurState, persist],
    );
    const ctx = useMemo(
      () => ({
        getState,
        setState,
      }),
      [getState, setState],
    );
    return (
      <persistentStateContext.Provider value={ctx}>
        {children}
      </persistentStateContext.Provider>
    );
  }
  const usePersistentState = (<K extends keyof PersistentState>(
    key?: K,
    def?: NonNullable<PersistentState[K]>,
  ) => {
    const ctx = useContext(persistentStateContext);
    if (!ctx) {
      throw new Error('Attempting to use context without a context provided');
    }
    const state = ctx.getState();
    if (key != null) {
      const val = state[key];
      if (val == null && def != null) {
        return def;
      }
      return val;
    }
    return state;
  }) as UsePersistentState<PersistentState>;
  return {
    PersistentStateProvider,
    usePersistentState,
  };
}
