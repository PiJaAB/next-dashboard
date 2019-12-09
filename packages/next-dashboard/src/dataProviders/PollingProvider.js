// @flow
import EventEmitter from 'events';

import {
  type DataType,
  NotImplementedError,
  type PollingFetcher,
  type DataExtra,
} from '../utils/types';

import type { InitialPropsContext } from '../utils/nextTypes';

import generateDataKey from '../utils/generateDataKey';

function wrapExtra(
  func: $PropertyType<PollingFetcher, 'runner'>,
  extra: DataExtra,
): $PropertyType<PollingFetcher, 'runner'> {
  return function runner(): $Call<
    $PropertyType<PollingFetcher, 'runner'>,
    DataExtra,
  > {
    return func.call(this, extra);
  };
}

type Mapper = <T>(T) => DataType<T>;

type MappedData<D> = $ObjMap<D, Mapper>;

/**
  Class that handles data subscription and polling for data.
  Will run relevant PollingFetcher's registered by the
  `addFetcher` method, when a component subscribes to data
  that fetcher provides.
*/
export default class PollingProvider<Data: {} = {}> extends EventEmitter {
  constructor() {
    super();

    // Bit of magic code. Due to how next works, it's hard to tell if the initialize
    // method has been called yet or not and we only want to actually initialize once.
    if (!this.initialize) {
      this.initialized = true;
    } else {
      let initialized = false;
      const { initialize: oldInitialize } = this;
      this.initialize = function initialize(ctx: InitialPropsContext) {
        if (initialized) return;
        initialized = true;
        oldInitialize.call(this, ctx);
      };
      Object.defineProperty(this, ('initialized': string), {
        get(): boolean {
          return initialized;
        },
      });
    }
  }

  async startFetcher(fetcher: PollingFetcher) {
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
      if (this.activeFetchers.has(fetcher.id) && fetcher.interval != null) {
        setTimeout(() => {
          this.startFetcher(fetcher);
        }, fetcher.interval * 1000);
      }
    }
  }

  addFetcher(fetcher: PollingFetcher | PollingFetcher[]) {
    const fetchers: PollingFetcher[] = Array.isArray(fetcher)
      ? fetcher
      : [fetcher];
    this.fetchers = this.fetchers.concat(fetchers);
  }

  +initialized: boolean;

  +initialize: ?(ctx: InitialPropsContext) => void;

  activeListeners: Map<string, Set<(any) => void>> = new Map();

  fetchers: PollingFetcher[] = [];

  activeFetchers: Map<string, PollingFetcher> = new Map();

  data: { [string]: ?DataType<> } = {};

  +start: ?(id: string) => void;

  +stop: ?(id: string) => void;

  setData(dataSource: string, data: ?DataType<>) {
    this.data[dataSource] = data;
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
    if (!this.data[key]) {
      return {
        status: 'loading',
      };
    }
    return this.data[key];
  };

  subscribe: <DS: $Keys<Data>>(
    cb: ($ElementType<MappedData<Data>, DS>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ) => void = (cb, dataSource, extra) => {
    const key = generateDataKey(dataSource, extra);
    if (this.activeListeners.has(key)) {
      // We've just checked for the existence using
      // the .has method, and since the map does not
      // contain maybetypes, this is now typechecked.
      // $FlowIssue
      const set: Set<($Keys<Data>) => void> = this.activeListeners.get(key);
      set.add(cb);
      return;
    }
    const set = new Set<($Keys<Data>) => void>();
    set.add(cb);
    this.activeListeners.set(key, set);
    if (this.activeFetchers.has(key)) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(
          'Fetcher is active, even though this is a new datafetcher. Desync in pollingprovider somewhere',
        );
      }
      return;
    }
    let fetcher: PollingFetcher | void = this.fetchers.find(({ id }) => {
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
    if (extra != null) {
      const { runner, id, ...rest } = fetcher;
      fetcher = ({
        ...rest,
        id: key,
        runner: wrapExtra(runner, extra),
      }: PollingFetcher);
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
    if (!this.activeListeners.has(key)) {
      console.warn(
        `Trying to unsubscribe to ${dataSource} without being subscribed to it.`,
      );
      return;
    }
    // We've just checked for the existence using
    // the .has method, and since the map does not
    // contain maybetypes, this is now typechecked.
    // $FlowIssue
    const set: Set<($Keys<Data>) => void> = this.activeListeners.get(key);
    if (!set.has(cb)) {
      console.warn(
        `Trying to unsubscribe to ${dataSource} without being subscribed to it.`,
      );
      return;
    }
    set.delete(cb);
    if (set.size === 0) {
      delete this.data[key];
      this.activeListeners.delete(key);
      this.activeFetchers.delete(key);
      this.emit('stop-poll', dataSource, extra);
    }
  };

  send<T>(_key: string, _data: T, _extra?: mixed): Promise<void> | void {
    throw new NotImplementedError();
  }

  getCurrentData(): MappedData<Data> {
    return this.data;
  }
}
