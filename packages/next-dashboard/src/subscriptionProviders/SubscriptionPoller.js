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

export function makePollingAlias<Data: {}, DS1: $Keys<Data>, DS2: $Keys<Data>>(
  parentId: DS1,
  id: DS2,
  parser: ($ElementType<Data, DS1>) => $ElementType<Data, DS2>,
): PollingFetcher<Data> {
  return {
    id,
    runner: parentId,
    parser,
  };
}

type ParsedPollingFetcher<Data: {}> = {
  +id: string,
  interval?: number | ((extra?: DataExtra) => number | void),
  runner: $Keys<Data> | ((extra?: DataExtra) => mixed),
  parser?: any => any,
};

/**
  Class that handles data subscription and polling for data.
  Will run relevant PollingFetcher's registered by the
  `addFetcher` method, when a component subscribes to data
  that fetcher provides.
*/
export default class SubscribtionPoller<Data: {} = {}> extends EventEmitter
  implements ISubscriptionProvider<Data> {
  constructor(
    fetcher?: PollingFetcher<Data> | $ReadOnlyArray<PollingFetcher<Data>>,
  ) {
    super();
    if (fetcher) this.addFetcher(fetcher);
  }

  async startFetcher(fetcher: ParsedPollingFetcher<Data>) {
    if (!this.activeFetchers.has(fetcher.id)) {
      return;
    }
    try {
      this.setUpdating(fetcher.id);
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
    const fetchers: $ReadOnlyArray<ParsedPollingFetcher<Data>> = Array.isArray(
      fetcher,
    )
      ? fetcher
      : [fetcher];
    this.fetchers.push(...fetchers);
  }

  activeListeners: Map<
    string,
    Set<(DataType<$ElementType<Data, $Keys<Data>>>) => void>,
  > = new Map();

  fetchers: ParsedPollingFetcher<Data>[] = [];

  activeFetchers: Map<string, ParsedPollingFetcher<Data>> = new Map();

  stoppingTimers: Map<string, TimeoutID> = new Map();

  dataCache: { [string]: ?DataType<> } = {};

  +start: ?(id: string) => void;

  +stop: ?(id: string) => void;

  setUpdating(dataSource: string): ?DataType<> {
    if (!this.dataCache[dataSource]) return;
    // $FlowIssue: I not sure why flow spazzes out...
    const newData: DataType<> = {
      ...this.dataCache[dataSource],
      updating: true,
    };
    this.setData(dataSource, newData);
  }

  setData<DS: $Keys<Data>>(
    dataSource: string,
    data: DataType<$ElementType<Data, DS>>,
  ) {
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
  ) => DataType<$ElementType<Data, DS>> = (dataSource, extra) => {
    const key = generateDataKey(dataSource, extra);
    if (!this.dataCache[key]) {
      return {
        status: 'loading',
      };
    }
    return this.dataCache[key];
  };

  aliasCallbacks: Map<
    string,
    (DataType<$ElementType<Data, $Keys<Data>>>) => void,
  > = new Map();

  subscribeAlias: <DS: $Keys<Data>>(
    cb: (DataType<$ElementType<Data, DS>>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ) => boolean = <DS: $Keys<Data>>(cb, dataSource, extra) => {
    const fetcher: ParsedPollingFetcher<Data> | void = this.fetchers.find(
      ({ id }) => {
        return id === dataSource;
      },
    );
    if (!fetcher) return false;
    if (typeof fetcher.runner !== 'string') return false;

    const parentSource: $Keys<Data> = fetcher.runner;

    const key = generateDataKey(dataSource, extra);

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

    set = new Set<(DataType<$ElementType<Data, DS>>) => void>();
    set.add(cb);
    this.activeListeners.set(key, set);

    const runner = data => {
      let parsed;
      if (!fetcher.parser || data.status !== 'success') {
        parsed = data;
      } else {
        parsed = {
          ...data,
          value: fetcher.parser(data.value),
        };
      }
      this.setData(key, parsed);
    };
    runner(this.read(parentSource, extra));
    this.aliasCallbacks.set(key, runner);
    this.subscribe<DS>(runner, parentSource, extra);
    return true;
  };

  unsubscribeAlias: <DS: $Keys<Data>>(
    cb: (DataType<$ElementType<Data, DS>>) => void,
    dataSource: string,
    extra?: DataExtra,
  ) => boolean = <DS: $Keys<Data>>(cb, dataSource, extra) => {
    const fetcher: ParsedPollingFetcher<Data> | void = this.fetchers.find(
      ({ id }) => {
        return id === dataSource;
      },
    );
    if (!fetcher) return false;
    if (typeof fetcher.runner !== 'string') return false;
    const parentSource: $Keys<Data> = fetcher.runner;

    const key = generateDataKey(dataSource, extra);
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
        setTimeout(() => {
          this.stoppingTimers.delete(key);
          delete this.dataCache[key];
          const runner = this.aliasCallbacks.get(key);
          if (runner) {
            this.aliasCallbacks.delete(key);
            this.unsubscribe<DS>(runner, parentSource, extra);
          }
          this.activeListeners.delete(key);
        }, 5000),
      );
    }
    return true;
  };

  subscribe: <DS: $Keys<Data>>(
    cb: (DataType<$ElementType<Data, DS>>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ) => void = <DS: $Keys<Data>>(cb, dataSource, extra) => {
    if (this.subscribeAlias(cb, dataSource, extra)) return;
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

    set = new Set<(DataType<$ElementType<Data, DS>>) => void>();
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
      fetcher = ({
        ...rest,
        id: key,
        runner: wrapExtra(runner, extra),
      }: ParsedPollingFetcher<Data>);
    }
    if (fetcher.interval !== interval) {
      fetcher = ({
        ...fetcher,
        interval,
      }: ParsedPollingFetcher<Data>);
    }
    this.activeFetchers.set(key, fetcher);
    this.startFetcher(fetcher);
    this.emit('start-poll', dataSource, extra);
  };

  unsubscribe: <DS: $Keys<Data>>(
    cb: (DataType<$ElementType<Data, DS>>) => void,
    dataSource: string,
    extra?: DataExtra,
  ) => void = (cb, dataSource, extra) => {
    if (this.unsubscribeAlias(cb, dataSource, extra)) return;
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
}
