// @flow
import EventEmitter from 'events';

import {
  type DataType,
  NotImplementedError,
  type Identity,
} from '../utils/types';

import type { InitialPropsContext } from '../utils/nextTypes';

export default class AbstractProvider extends EventEmitter {
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
      setTimeout(() => {
        // eslint-disable-next-line no-cond-assign
        this.emitData(mutation);
      }, 0);
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
  }

  activeListeners: {
    [string]: ?number,
  } = {};

  listenersSet = new Set<string>();

  data: { [string]: DataType } = {};

  +initialized: boolean;

  +initialize: ?(ctx: InitialPropsContext) => void;

  +start: ?(id: string) => void;

  +stop: ?(id: string) => void;

  +emitData: (newData: { [string]: DataType }) => void;

  mutate(newData: { [string]: DataType }) {
    const entries: [string, DataType][] = (Object.entries(newData): any);
    entries.forEach(([key, entry]) => {
      this.data[key] = entry;
    });
    this.emitData(newData);
  }

  getActiveListeners(): $ReadOnlyArray<string> {
    return [...this.listenersSet];
  }

  listen: (id: string) => void = id => {
    const curListeners = Math.max(this.activeListeners[id] || 0, 0);
    this.activeListeners[id] = curListeners + 1;
    if (!this.listenersSet.has(id)) {
      this.listenersSet.add(id);
      this.emit('listen', id);
    }
  };

  unListen: (id: string) => void = id => {
    const curListeners = this.activeListeners[id] || 0;
    this.activeListeners[id] = Math.max(curListeners - 1, 0);
    if (this.activeListeners[id] === 0) {
      this.listenersSet.delete(id);
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
