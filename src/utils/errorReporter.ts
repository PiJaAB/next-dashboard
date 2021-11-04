import EventEmitter from 'events';
import { SiteMessageType } from './types';

export const errorEventEmitter = new EventEmitter();

class ErrorReporter {
  constructor() {
    const runQueue = () => {
      const unresolved: typeof this.cache = [];
      while (this.cache.length > 0) {
        const entry = this.cache.pop() as this['cache'][number];
        const { err, resolve } = entry;
        if (
          err instanceof Error &&
          errorEventEmitter.listenerCount('error') > 0
        ) {
          resolve(errorEventEmitter.emit('error', err));
        } else if (errorEventEmitter.listenerCount('error') > 0) {
          resolve(errorEventEmitter.emit('report', err));
        } else {
          unresolved.push(entry);
        }
      }
      this.cache.push(...unresolved);
    };
    errorEventEmitter.on('newListener', () => {
      if (
        errorEventEmitter.listenerCount('error') === 0 ||
        errorEventEmitter.listenerCount('report') === 0
      ) {
        // The EventEmitter instance will emit its own 'newListener' event before a listener is added to its internal array of listeners.
        if (this.timeout == null) {
          this.timeout = setTimeout(() => {
            this.timeout = null;
            runQueue();
          }, 0);
        }
      }
    });
    this.report = this.report.bind(this);
  }

  timeout: NodeJS.Timeout | number | null = null;

  cache: { resolve: (res: boolean) => void; err: Error | SiteMessageType }[] =
    [];

  report(err: Error | SiteMessageType): Promise<boolean> {
    if (err instanceof Error && errorEventEmitter.listenerCount('error') > 0) {
      return Promise.resolve(errorEventEmitter.emit('error', err));
    }
    if (errorEventEmitter.listenerCount('report') > 0) {
      return Promise.resolve(errorEventEmitter.emit('report', err));
    }
    return new Promise((resolve) => {
      this.cache.unshift({
        resolve,
        err,
      });
    });
  }
}

export default new ErrorReporter();
