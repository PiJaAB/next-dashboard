// @flow
import EventEmitter from 'events';

import {
  type DataType,
  NotImplementedError,
  type Identity,
  type PollingFetcher,
} from '../utils/types';

import type { InitialPropsContext } from '../utils/nextTypes';

/**
  Class that handles data subscription and polling for data.
  Will run relevant PollingFetcher's registered by the
  `addFetcher` method, when a component subscribes to data
  that fetcher provides.
*/
export default class PollingProvider extends EventEmitter {
  constructor() {
    super();
    let listenerCache: { [string]: DataType }[] = [];
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
    this.emitData = (newData: { [string]: DataType }) => {
      if (!this.emit('data', newData)) {
        listenerCache.push(newData);
      }
    };
    if (!this.initialize) {
      this.initialized = true;
    } else {
      let initialized = false;
      const { initialize } = this;
      this.initialize = (ctx: InitialPropsContext) => {
        if (initialized) return;
        initialized = true;
        initialize.call(this, ctx);
      };
      Object.defineProperty(this, ('initialized': string), {
        get(): boolean {
          return initialized;
        },
      });
    }
    this.startFetcher = async (fetcher: PollingFetcher) => {
      if (!this.activeFetchers.has(fetcher)) {
        return;
      }
      try {
        const res = await fetcher.runner.call(this);
        const ids: string[] = Array.isArray(fetcher.id)
          ? fetcher.id
          : [fetcher.id];
        if (!this.activeFetchers.has(fetcher)) {
          return;
        }
        this.mutate(
          ids.reduce(
            (mutation, id) =>
              ({
                ...mutation,
                [id]: { status: 'success', value: res[id] },
              }: { [string]: DataType }),
            ({}: { [string]: DataType }),
          ),
        );
      } catch (err) {
        const ids: string[] = Array.isArray(fetcher.id)
          ? fetcher.id
          : [fetcher.id];
        if (!this.activeFetchers.has(fetcher)) {
          return;
        }
        this.mutate(
          ids.reduce(
            (mutation, id) =>
              ({
                ...mutation,
                [id]: { status: 'error', error: err },
              }: { [string]: DataType }),
            ({}: { [string]: DataType }),
          ),
        );
        this.emit('error', err);
      } finally {
        if (this.activeFetchers.has(fetcher) && fetcher.interval != null) {
          setTimeout(() => {
            this.startFetcher(fetcher);
          }, fetcher.interval * 1000);
        }
      }
    };
  }

  +startFetcher: PollingFetcher => Promise<void>;

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

  activeFetchers: Set<PollingFetcher> = new Set();

  listenersSet = new Set<string>();

  data: { [string]: DataType } = {};

  +initialized: boolean;

  +initialize: ?(ctx: InitialPropsContext) => void;

  +start: ?(id: string) => void;

  +stop: ?(id: string) => void;

  +emitData: (newData: { [string]: DataType }) => void;

  mutate(newData: { [string]: DataType }) {
    const entries: [string, DataType][] = (Object.entries(newData) /*:any*/);
    entries.forEach(([key, entry]) => {
      this.data[key] = entry;
    });
    this.emitData(newData);
  }

  getActiveListeners(): $ReadOnlyArray<string> {
    return [...this.listenersSet];
  }

  removeFetcherIfNotUsable(id: string) {
    const fetcher = [...this.activeFetchers].find(f => {
      if (Array.isArray(f.id)) {
        return f.id.includes(id);
      }
      return f.id === id;
    });
    if (!fetcher) return;
    const ids: string[] = Array.isArray(fetcher.id) ? fetcher.id : [fetcher.id];
    const used = ids.find(cid => this.listenersSet.has(cid)) != null;
    if (!used) {
      this.activeFetchers.delete(fetcher);
      this.mutate(
        ids.reduce((mutation, cid) => ({ ...mutation, [cid]: undefined }), {}),
      );
    }
  }

  addFetcherIfNotAdded(id: string) {
    const fetcher = this.fetchers.find(f => {
      if (Array.isArray(f.id)) {
        return f.id.includes(id);
      }
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
    if (this.activeFetchers.has(fetcher)) return;
    this.activeFetchers.add(fetcher);
    this.startFetcher(fetcher);
  }

  listen: (id: string) => void = id => {
    const curListeners = Math.max(this.activeListeners[id] || 0, 0);
    this.activeListeners[id] = curListeners + 1;
    if (!this.listenersSet.has(id)) {
      this.listenersSet.add(id);
      this.addFetcherIfNotAdded(id);
      this.emit('listen', id);
    }
  };

  unListen: (id: string) => void = id => {
    const curListeners = this.activeListeners[id] || 0;
    this.activeListeners[id] = Math.max(curListeners - 1, 0);
    if (this.activeListeners[id] === 0) {
      this.listenersSet.delete(id);
      this.removeFetcherIfNotUsable(id);
      this.emit('unListen', id);
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

  getCurrentData(): { +[string]: DataType } {
    return this.data;
  }
}
