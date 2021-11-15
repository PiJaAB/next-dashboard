import EventEmitter from 'events';
import { SiteMessageType } from './types';

export const statusEventEmitter = new EventEmitter();

class StatusReporter {
  constructor() {
    const runQueue = () => {
      const unresolved: typeof this.cache = [];
      while (this.cache.length > 0) {
        const entry = this.cache.pop() as this['cache'][number];
        const { err, resolve } = entry;
        if (
          err instanceof Error &&
          statusEventEmitter.listenerCount('error') > 0
        ) {
          resolve(statusEventEmitter.emit('error', err));
        } else if (statusEventEmitter.listenerCount('error') > 0) {
          resolve(statusEventEmitter.emit('report', err));
        } else {
          unresolved.push(entry);
        }
      }
      this.cache.push(...unresolved);
    };
    statusEventEmitter.on('newListener', () => {
      if (
        statusEventEmitter.listenerCount('error') === 0 ||
        statusEventEmitter.listenerCount('report') === 0
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
    if (err instanceof Error && statusEventEmitter.listenerCount('error') > 0) {
      return Promise.resolve(statusEventEmitter.emit('error', err));
    }
    if (statusEventEmitter.listenerCount('report') > 0) {
      return Promise.resolve(statusEventEmitter.emit('report', err));
    }
    return new Promise((resolve) => {
      this.cache.unshift({
        resolve,
        err,
      });
    });
  }
}

export default new StatusReporter();
