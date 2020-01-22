// @flow
import EventEmitter from 'events';

import {
  type DataType,
  NotImplementedError,
  type PollingFetcher,
  type DataExtra,
  type ISubscriptionProvider,
} from '../utils/types';

import generateDataKey from '../utils/generateDataKey';
import logger from '../utils/logger';

function wrapExtra<Data: {}>(
  func: $PropertyType<PollingFetcher<Data>, 'runner'>,
  extra: DataExtra,
): $PropertyType<PollingFetcher<Data>, 'runner'> {
  return function runner(): $Call<
    $PropertyType<PollingFetcher<Data>, 'runner'>,
    DataExtra,
  > {
    return func.call(this, extra);
  };
}

type Mapper = <T>(T) => DataType<T>;

type MappedData<D> = $ObjMap<D, Mapper>;

type ParsedPollingFetcher = {
  +id: string,
  interval?: number | ((extra?: DataExtra) => number | void),
  runner: (extra?: DataExtra) => mixed,
};

/**
  Class that handles data subscription and polling for data.
  Will run relevant PollingFetcher's registered by the
  `addFetcher` method, when a component subscribes to data
  that fetcher provides.
*/
export default class SubscribtionPoller<Data: {} = {}> extends EventEmitter
  implements ISubscriptionProvider<Data> {
  constructor(fetcher?: PollingFetcher<Data> | PollingFetcher<Data>[]) {
    super();
    if (fetcher) this.addFetcher(fetcher);
  }

  async startFetcher(fetcher: ParsedPollingFetcher) {
    if (!this.activeFetchers.has(fetcher.id)) {
      return;
    }
    try {
      const res = await fetcher.runner.call(this);
      if (!this.activeFetchers.has(fetcher.id)) {
        return;
      }
      this.setData(fetcher.id, { status: 'success', value: res });
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

  addFetcher(
    fetcher: PollingFetcher<Data> | $ReadOnlyArray<PollingFetcher<Data>>,
  ) {
    const fetchers: $ReadOnlyArray<ParsedPollingFetcher> = Array.isArray(
      fetcher,
    )
      ? fetcher
      : [fetcher];
    this.fetchers.push(...fetchers);
  }

  activeListeners: Map<string, Set<(any) => void>> = new Map();

  fetchers: ParsedPollingFetcher[] = [];

  activeFetchers: Map<string, ParsedPollingFetcher> = new Map();

  stoppingTimers: Map<string, TimeoutID> = new Map();

  dataCache: { [string]: ?DataType<> } = {};

  +start: ?(id: string) => void;

  +stop: ?(id: string) => void;

  setData(dataSource: string, data: ?DataType<>) {
    this.dataCache[dataSource] = data;
    const listeners = this.activeListeners.get(dataSource);
    if (listeners) listeners.forEach(listener => listener(data));
  }

  getActiveListeners(): $ReadOnlyArray<string> {
    return [...this.activeListeners.keys()];
  }

  read: <DS: $Keys<Data>>(
    dataSource: DS,
    extra?: DataExtra,
  ) => $ElementType<MappedData<Data>, DS> = (dataSource, extra) => {
    const key = generateDataKey(dataSource, extra);
    if (!this.dataCache[key]) {
      return {
        status: 'loading',
      };
    }
    return this.dataCache[key];
  };

  subscribe: <DS: $Keys<Data>>(
    cb: ($ElementType<MappedData<Data>, DS>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ) => void = (cb, dataSource, extra) => {
    const key = generateDataKey(dataSource, extra);
    let set = this.activeListeners.get(key);
    if (set) {
      set.add(cb);
      return;
    }

    const wasStopped = this.stoppingTimers.has(key);
    const stoppingTimer = this.stoppingTimers.get(key);
    if (stoppingTimer != null) {
      this.stoppingTimers.delete(key);
      clearTimeout(stoppingTimer);
    }

    set = new Set<($Keys<Data>) => void>();
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
    let fetcher: ParsedPollingFetcher | void = this.fetchers.find(({ id }) => {
      return id === dataSource;
    });
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
      fetcher = ({
        ...rest,
        id: key,
        runner: wrapExtra(runner, extra),
      }: ParsedPollingFetcher);
    }
    if (fetcher.interval !== interval) {
      fetcher = ({
        ...fetcher,
        interval,
      }: ParsedPollingFetcher);
    }
    this.activeFetchers.set(key, fetcher);
    this.startFetcher(fetcher);
    this.emit('start-poll', dataSource, extra);
  };

  unsubscribe: <DS: $Keys<Data>>(
    cb: ($ElementType<MappedData<Data>, DS>) => void,
    dataSource: string,
    extra?: DataExtra,
  ) => void = (cb, dataSource, extra) => {
    const key = generateDataKey(dataSource, extra);
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
        setTimeout(() => {
          this.stoppingTimers.delete(key);
          this.activeFetchers.delete(key);
          delete this.dataCache[key];
        }, 5000),
      );
      this.activeListeners.delete(key);
      this.emit('stop-poll', dataSource, extra);
    }
  };

  send<T>(_key: string, _data: T, _extra?: mixed): Promise<void> | void {
    throw new NotImplementedError();
  }

  getCurrentData(): MappedData<Data> {
    return this.dataCache;
  }
}
