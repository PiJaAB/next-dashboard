// @flow

// This is an Error proxy, to ensure that the automatic sitewide
// error reporter does not display this error.

export class SilentError extends Error {
  constructor(error: ?Error | string) {
    if (error && typeof error === 'object') {
      super();
      const self = this;
      // $FlowIssue: Flow not like getters in defineProperties
      Object.defineProperties(this, {
        name: {
          get: () => error.name,
        },
        message: {
          get: () => error.message,
        },
        description: {
          get: () => error.description,
        },
        number: {
          get: () => error.number,
        },
        fileName: {
          get: () => error.fileName,
        },
        lineNumber: {
          get: () => error.lineNumber,
        },
        columnNumber: {
          get: () => error.columnNumber,
        },
        stack: {
          get: () => error.stack,
        },
        toSource: {
          get: () => {
            // $FlowIssue: non-standard but documented prop.
            if (typeof error.toSource !== 'function') {
              return error.toSource;
            }
            // eslint-disable-next-line flowtype/no-weak-types
            return function toSource(...args: any[]) {
              const thisObj = self === this ? error : this;
              // $FlowIssue: non-standard but documented prop.
              error.toSource.call(thisObj, ...args);
            };
          },
        },
        toString: {
          get: () => {
            if (typeof error.toString !== 'function') {
              return error.toString;
            }
            // eslint-disable-next-line flowtype/no-weak-types
            return function toString(...args: any[]) {
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

export function makeSilent(error: Error): empty {
  throw new SilentError(error);
}
