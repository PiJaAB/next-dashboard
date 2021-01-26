// @flow

// This is an Error proxy, to ensure that the automatic sitewide
// error reporter does not display this error.

export class SilentError extends Error {
  constructor(error?: Error | string) {
    if (error && typeof error === 'object') {
      super();
      const self = this;
      Object.defineProperties(this, {
        name: {
          get: () => error.name,
        },
        message: {
          get: () => error.message,
        },
        toString: {
          get: () => {
            if (typeof error.toString !== 'function') {
              return error.toString;
            }
            return function toString(this: unknown, ...args: []) {
              const thisObj = self === this ? error : this;
              error.toString.call(thisObj, ...args);
            };
          },
        },
      });
    } else {
      super(error);
    }
  }
}

SilentError.prototype.name = 'SilentError';

export function makeSilent(error: Error): never {
  throw new SilentError(error);
}
