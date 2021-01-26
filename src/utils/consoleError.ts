import { SilentError } from './silentError';
import logger from './logger';

// This is an Error proxy, to ensure that the automatic sitewide
// error reporter does not display this error. It does however
// automatically log the error to the console.

export class ConsoleError extends SilentError {
  constructor(error?: Error | string) {
    super(error);
    logger.error(this);
  }
}

SilentError.prototype.name = 'ConsoleError';

export function makeConsole(error: Error): never {
  throw new ConsoleError(error);
}
