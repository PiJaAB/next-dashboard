import EventEmitter from 'events';

import {
  DataType,
  PollingFetcher,
  DataExtra,
  ISubscriptionProvider,
} from '../utils/types';

import generateDataKey from '../utils/generateDataKey';
import logger from '../utils/logger';

function wrapExtra<Data extends {}>(
  func: PollingFetcher<Data>['runner'],
  extra: DataExtra,
): PollingFetcher<Data>['runner'] {
  if (typeof func !== 'function') {
    throw new Error('Wrap non-function runner.');
  }
  type RetType = typeof func extends (arg: DataExtra) => infer T ? T : never;
  return function runner(this: ParsedPollingFetcher<any>): RetType {
    return func.call(this, extra);
  };
}

export function makePollingAlias<
  Data extends {},
  DS1 extends keyof Data,
  DS2 extends keyof Data
>(
  parentId: DS1,
  id: DS2,
  parser: (inputData: Data[DS1]) => Data[DS2],
): PollingFetcher<Data> {
  return {
    id,
    runner: parentId,
    parser,
  };
}

interface ParsedPollingFetcher<Data extends {}> {
  id: keyof Data;
  interval?: number | ((extra?: DataExtra) => number | void);
  runner: keyof Data | (keyof Data)[] | ((extra?: DataExtra) => unknown);
  parser?: (...inputData: any[]) => any;
}

interface CallbackMap<Data extends {}>
  extends Map<keyof Data, Set<(data: DataType<Data[keyof Data]>) => void>> {
  clear(): void;
  delete(key: keyof Data): boolean;
  get<DS extends keyof Data>(
    key: DS,
  ): Set<(data: DataType<Data[DS]>) => void> | undefined;
  has(key: keyof Data): boolean;
  set<DS extends keyof Data>(
    key: keyof Data,
    value: Set<(data: DataType<Data[DS]>) => void>,
  ): this;
  readonly size: number;
}

interface AliasCallbackMap<Data extends {}>
  extends Map<
    keyof Data,
    readonly (readonly [
      keyof Data,
      (data: DataType<Data[keyof Data]>) => void,
    ])[]
  > {
  get<DS extends keyof Data>(
    key: DS,
  ):
    | readonly (readonly [keyof Data, (data: DataType<Data[DS]>) => void])[]
    | undefined;
  set<DS extends keyof Data>(
    key: keyof Data,
    value: readonly (readonly [
      keyof Data,
      (data: DataType<Data[DS]>) => void,
    ])[],
  ): this;
}

/**
  Class that handles data subscription and polling for data.
  Will run relevant PollingFetcher's registered by the
  `addFetcher` method, when a component subscribes to data
  that fetcher provides.
*/
export default class SubscribtionPoller<Data extends {} = {}>
  extends EventEmitter
  implements ISubscriptionProvider<Data> {
  constructor(fetcher?: PollingFetcher<Data> | PollingFetcher<Data>[]) {
    super();
    if (fetcher) this.addFetcher(fetcher);
  }

  async startFetcher(fetcher: ParsedPollingFetcher<Data>): Promise<void> {
    if (!this.activeFetchers.has(fetcher.id)) {
      return;
    }
    try {
      this.setUpdating(fetcher.id);
      if (typeof fetcher.runner !== 'function') {
        throw new Error('Attempting to start fetcher without runner.');
      }
      const res = await fetcher.runner.call(this);
      if (!this.activeFetchers.has(fetcher.id)) {
        return;
      }
      this.setData(fetcher.id, {
        status: 'success',
        value: res as Data[keyof Data],
      });
    } catch (err) {
      if (!this.activeFetchers.has(fetcher.id)) {
        return;
      }
      this.setData(fetcher.id, { status: 'error', error: err });
      this.emit('error', err);
    } finally {
      if (
        this.activeFetchers.has(fetcher.id) &&
        typeof fetcher.interval === 'number'
      ) {
        setTimeout(() => {
          this.startFetcher(fetcher);
        }, fetcher.interval * 1000);
      }
    }
  }

  addFetcher(fetcher: PollingFetcher<Data> | PollingFetcher<Data>[]): void {
    const fetchers: ParsedPollingFetcher<Data>[] = Array.isArray(fetcher)
      ? (fetcher as ParsedPollingFetcher<Data>[])
      : [fetcher as ParsedPollingFetcher<Data>];
    this.fetchers.push(...fetchers);
  }

  activeListeners: CallbackMap<Data> = new Map();

  fetchers: ParsedPollingFetcher<Data>[] = [];

  activeFetchers: Map<keyof Data, ParsedPollingFetcher<Data>> = new Map();

  stoppingTimers: Map<keyof Data, number> = new Map();

  dataCache: Partial<{ [key in keyof Data]: DataType<Data[key]> }> = {};

  readonly start?: (id: string) => void;

  readonly stop?: (id: string) => void;

  setUpdating<DS extends keyof Data>(
    dataSource: DS,
  ): DataType<Data[DS]> | undefined {
    const oldData = this.dataCache[dataSource];
    if (oldData == null) return;
    const newData: DataType<Data[DS]> = {
      ...(oldData as DataType<Data[DS]>),
      updating: true,
    };
    this.setData(dataSource, newData);
  }

  setData<DS extends keyof Data>(
    dataSource: DS,
    data: DataType<Data[DS]>,
  ): void {
    this.dataCache[dataSource] = data;
    const listeners = this.activeListeners.get(dataSource);
    if (listeners) listeners.forEach((listener) => listener(data));
  }

  getActiveListeners(): (keyof Data)[] {
    return [...this.activeListeners.keys()];
  }

  read<DS extends keyof Data>(
    dataSource: DS,
    extra?: DataExtra,
  ): DataType<Data[DS]> {
    const key = generateDataKey<Data, DS>(dataSource, extra);
    const cached = this.dataCache[key];
    if (cached == null) {
      return {
        status: 'loading',
      };
    }
    return cached as DataType<Data[DS]>;
  }

  aliasCallbacks: AliasCallbackMap<Data> = new Map();

  subscribeAlias<DS extends keyof Data>(
    cb: (data: DataType<Data[DS]>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): boolean {
    const fetcher: ParsedPollingFetcher<Data> | void = this.fetchers.find(
      ({ id }) => {
        return id === dataSource;
      },
    );
    if (!fetcher) return false;
    if (typeof fetcher.runner === 'function') return false;
    const parentSources: readonly (keyof Data)[] = Array.isArray(fetcher.runner)
      ? fetcher.runner
      : [fetcher.runner];

    const key = generateDataKey<Data, DS>(dataSource, extra);

    const stoppingTimer = this.stoppingTimers.get(key);
    if (stoppingTimer != null) {
      this.stoppingTimers.delete(key);
      clearTimeout(stoppingTimer);
    }
    let set = this.activeListeners.get(key);
    if (set) {
      set.add(cb);
      return true;
    }

    set = new Set<(data: DataType<Data[DS]>) => void>();
    set.add(cb);
    this.activeListeners.set(key, set);

    const cache: DataType<Data[keyof Data]>[] = parentSources.map((source) =>
      this.read(source, extra),
    );
    const runners = parentSources.map((parentSource: keyof Data, i) => {
      const runner = (data: DataType<Data[DS]>) => {
        cache[i] = data;
        const errorEntry = cache.find((c) => c.status === 'error');
        if (errorEntry) {
          if (this.dataCache[key] !== errorEntry) {
            this.setData(key, errorEntry);
          }
          return;
        }
        const allDone = !cache.some((c) => c.status !== 'success');
        const updating = cache.some(
          (c) => c.status === 'success' && c.updating,
        );
        if (allDone) {
          const values = cache.map((c) => c.value);
          this.setData(key, {
            status: 'success',
            updating,
            value: fetcher.parser ? fetcher.parser(...values) : values,
          });
          return;
        }
        const cacheEntry = this.dataCache[key];
        if (cacheEntry == null || cacheEntry.status !== 'loading')
          this.setData(key, {
            status: 'loading',
          });
      };
      this.subscribe<DS>(runner, parentSource as DS, extra);
      return [parentSource, runner] as const;
    });
    const allDone = !cache.some((c) => c.status !== 'success');
    const updating = cache.some((c) => c.status === 'success' && c.updating);
    if (allDone) {
      const values = cache.map((c) => c.value);
      this.setData(key, {
        status: 'success',
        updating,
        value: fetcher.parser ? fetcher.parser(...values) : values,
      });
    }
    this.aliasCallbacks.set(key, runners);
    return true;
  }

  unsubscribeAlias<DS extends keyof Data>(
    cb: (data: DataType<Data[DS]>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): boolean {
    const fetcher: ParsedPollingFetcher<Data> | void = this.fetchers.find(
      ({ id }) => {
        return id === dataSource;
      },
    );
    if (!fetcher) return false;
    if (typeof fetcher.runner === 'function') return false;

    const key = generateDataKey<Data, DS>(dataSource, extra);
    const set = this.activeListeners.get(key);

    if (!set) {
      logger.warn(
        `Trying to unsubscribe from alias ${dataSource} without being subscribed to it. 1`,
      );
      return true;
    }

    if (!set.has(cb)) {
      logger.warn(
        `Trying to unsubscribe from alias ${dataSource} without being subscribed to it. 2`,
      );
      return true;
    }
    set.delete(cb);
    if (set.size === 0) {
      this.stoppingTimers.set(
        key,
        window.setTimeout(() => {
          this.stoppingTimers.delete(key);
          delete this.dataCache[key];
          const runners = this.aliasCallbacks.get(key);
          if (runners) {
            this.aliasCallbacks.delete(key);
            runners.forEach(([parentSource, runner]) => {
              this.unsubscribe<DS>(runner, parentSource as DS, extra);
            });
          }
          this.activeListeners.delete(key);
        }, 5000),
      );
    }
    return true;
  }

  subscribe<DS extends keyof Data>(
    cb: (data: DataType<Data[DS]>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void {
    if (this.subscribeAlias(cb, dataSource, extra)) return;
    const key = generateDataKey<Data, DS>(dataSource, extra);
    let set = this.activeListeners.get(key);
    if (set != null) {
      set.add(cb);
      return;
    }

    const wasStopped = this.stoppingTimers.has(key);
    const stoppingTimer = this.stoppingTimers.get(key);
    if (stoppingTimer != null) {
      this.stoppingTimers.delete(key);
      clearTimeout(stoppingTimer);
    }

    set = new Set<(data: DataType<Data[DS]>) => void>();
    set.add(cb);
    this.activeListeners.set(key, set);
    if (this.activeFetchers.has(key)) {
      if (!wasStopped) {
        logger.warn(
          'Fetcher is active, even though this is a new datafetcher. Desync in pollingprovider somewhere',
        );
      }
      return;
    }
    let fetcher: ParsedPollingFetcher<Data> | void = this.fetchers.find(
      ({ id }) => {
        return id === dataSource;
      },
    );
    if (!fetcher) {
      const err = new Error(`No datafetcher registered for id '${dataSource}'`);
      this.emit('error', err);
      this.setData(key, {
        error: err,
        status: 'error',
      });
      return;
    }
    const interval =
      typeof fetcher.interval === 'function'
        ? fetcher.interval(extra)
        : fetcher.interval;
    if (extra != null) {
      const { runner, ...rest } = fetcher;
      fetcher = {
        ...rest,
        id: key,
        runner: wrapExtra(runner, extra),
      } as ParsedPollingFetcher<Data>;
    }
    if (fetcher.interval !== interval) {
      fetcher = {
        ...fetcher,
        interval,
      } as ParsedPollingFetcher<Data>;
    }
    this.activeFetchers.set(key, fetcher);
    this.startFetcher(fetcher);
    this.emit('start-poll', dataSource, extra);
  }

  unsubscribe<DS extends keyof Data>(
    cb: (data: DataType<Data[DS]>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void {
    if (this.unsubscribeAlias(cb, dataSource, extra)) return;
    const key = generateDataKey<Data, DS>(dataSource, extra);
    const set = this.activeListeners.get(key);
    if (!set) {
      logger.warn(
        `Trying to unsubscribe to ${dataSource} without being subscribed to it.`,
      );
      return;
    }

    if (!set.has(cb)) {
      logger.warn(
        `Trying to unsubscribe to ${dataSource} without being subscribed to it.`,
      );
      return;
    }
    set.delete(cb);
    if (set.size === 0) {
      this.stoppingTimers.set(
        key,
        window.setTimeout(() => {
          this.stoppingTimers.delete(key);
          this.activeFetchers.delete(key);
          delete this.dataCache[key];
        }, 5000),
      );
      this.activeListeners.delete(key);
      this.emit('stop-poll', dataSource, extra);
    }
  }
}
