// @flow

import { SilentError } from './silentError';

// This is an Error proxy, to ensure that the automatic sitewide
// error reporter does not display this error. It does however
// automatically log the error to the console.

export class ConsoleError extends SilentError {
  constructor(error: ?Error | string) {
    super(error);
    // Purpose of this class is to create an error that gets logged
    // to console, but not automatically get put as an error on the
    // site
    // eslint-disable-next-line no-restricted-syntax
    console.error(this);
  }
}

SilentError.prototype.name = 'ConsoleError';

export function makeConsole(error: Error): empty {
  throw new ConsoleError(error);
}
