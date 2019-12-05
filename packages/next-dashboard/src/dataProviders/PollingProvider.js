// @flow
import EventEmitter from 'events';

import {
  type DataType,
  NotImplementedError,
  type Identity,
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

class FetcherMap {
  set: Set<PollingFetcher> = new Set();

  map: Map<string, PollingFetcher> = new Map();

  has(fetcher: PollingFetcher | string, extra?: DataExtra): boolean {
    if (typeof fetcher === 'object') {
      if (extra == null) return this.set.has(fetcher);
      return this.map.has(generateDataKey(fetcher.id, extra));
    }
    return this.map.has(generateDataKey(fetcher, extra));
  }

  add(fetcher: PollingFetcher, extra?: DataExtra) {
    this.set.add(fetcher);
    this.map.set(generateDataKey(fetcher.id, extra), fetcher);
  }

  delete(fetcher: PollingFetcher | string, extra?: DataExtra) {
    if (typeof fetcher === 'object') {
      this.set.delete(fetcher);
      this.map.delete(generateDataKey(fetcher.id, extra));
    } else {
      const key = generateDataKey(fetcher, extra);
      const fetcherObj = this.map.get(key);
      this.map.delete(key);
      if (fetcherObj) this.set.delete(fetcherObj);
    }
  }
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

    // Workaround for a race condition. Re-emit data
    // once a listener is registered if noone was before
    let listenerCache: { +[string]: ?DataType<> }[] = [];
    this.on('newListener', event => {
      if (event !== 'data' || !listenerCache.length) return;
      const mutation = listenerCache.reduce((accMut, curMut) => ({
        ...accMut,
        ...curMut,
      }));
      listenerCache = [];
      // At this point in time, the new event listener
      // is not registered, so we need to wait until
      // this function has returned to actually do the
      // emit.
      setTimeout(this.emitData, 0, mutation);
    });

    // Make sure a context is actually listening for data updates
    // and if not, cache the entries for re-emitting once a new
    // listener is registered.
    this.emitData = (newData: { +[string]: ?DataType<> }) => {
      if (!this.emit('data', newData)) {
        listenerCache.push(newData);
      }
    };

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
    if (!this.activeFetchers.has(fetcher)) {
      return;
    }
    try {
      const res = await fetcher.runner.call(this);
      if (!this.activeFetchers.has(fetcher)) {
        return;
      }
      this.mutate({
        [fetcher.id]: { status: 'success', value: res },
      });
    } catch (err) {
      if (!this.activeFetchers.has(fetcher)) {
        return;
      }
      this.mutate({
        [fetcher.id]: { status: 'error', error: err },
      });
      this.emit('error', err);
    } finally {
      if (this.activeFetchers.has(fetcher) && fetcher.interval != null) {
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

  activeListeners: {
    [string]: ?number,
  } = {};

  fetchers: PollingFetcher[] = [];

  activeFetchers: FetcherMap = new FetcherMap();

  listenersSet = new Set<string>();

  data: MappedData<Data> = ({}: any);

  +initialized: boolean;

  +initialize: ?(ctx: InitialPropsContext) => void;

  +start: ?(id: string) => void;

  +stop: ?(id: string) => void;

  +emitData: (newData: { +[string]: ?DataType<> }) => void;

  mutate(newData: { +[string]: ?DataType<> }) {
    const entries: [string, ?DataType<>][] = (Object.entries(newData) /*:any*/);
    entries.forEach(([key, entry]) => {
      this.data[key] = entry;
    });
    this.emitData(newData);
  }

  getActiveListeners(): $ReadOnlyArray<string> {
    return [...this.listenersSet];
  }

  addFetcherIfNotAdded(id: string, extra?: DataExtra) {
    if (this.activeFetchers.has(id, extra)) return;
    let fetcher: PollingFetcher | void = this.fetchers.find(f => {
      return f.id === id;
    });
    if (!fetcher) {
      const err = new Error(`No datafetcher registered for id '${id}'`);
      this.emit('error', err);
      this.mutate({
        [id]: {
          error: err,
          status: 'error',
        },
      });
      return;
    }
    if (extra != null) {
      const { runner, ...rest } = fetcher;
      fetcher = ({
        ...rest,
        runner: wrapExtra(runner, extra),
      }: PollingFetcher);
    }
    this.activeFetchers.add(fetcher, extra);
    this.startFetcher(fetcher);
  }

  listen: (dataSource: string, extra?: DataExtra) => void = (
    dataSource,
    extra,
  ) => {
    const curListeners = Math.max(this.activeListeners[dataSource] || 0, 0);
    this.activeListeners[dataSource] = curListeners + 1;
    if (!this.listenersSet.has(dataSource)) {
      this.listenersSet.add(dataSource);
      this.addFetcherIfNotAdded(dataSource);
      this.emit('listen', dataSource, extra);
    }
  };

  unListen: (dataSource: string, extra?: DataExtra) => void = (
    dataSource,
    extra,
  ) => {
    const curListeners = this.activeListeners[dataSource] || 0;
    this.activeListeners[dataSource] = Math.max(curListeners - 1, 0);
    if (this.activeListeners[dataSource] === 0) {
      this.listenersSet.delete(dataSource);
      this.activeFetchers.delete(dataSource, extra);
      this.emit('unListen', dataSource, extra);
    }
  };

  send<T>(_key: string, _data: T, _extra?: mixed): Promise<void> | void {
    throw new NotImplementedError();
  }

  getIdentity(): ?Identity {
    return null;
  }

  get isAuthenticated(): boolean {
    return Boolean(this.getIdentity());
  }

  isAuthorizedForRoute(
    _href: string,
    _asPath: string,
    _query: { [string]: string | void },
  ): boolean {
    return Boolean(this.getIdentity());
  }

  getCurrentData(): MappedData<Data> {
    return this.data;
  }
}
