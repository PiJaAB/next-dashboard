// @flow

/* eslint-disable no-console */
function printLog(level?: string, ...args: mixed[]) {
  console.log(`[NEXT-DASHBOARD]${level ? `[${level}]` : ''}`, ...args);
}
function printWarn(level?: string, ...args: $ReadOnlyArray<mixed>) {
  console.warn(`[NEXT-DASHBOARD]${level ? `[${level}]` : ''}`, ...args);
}
function printError(level?: string, ...args: mixed[]) {
  console.log(`[NEXT-DASHBOARD]${level ? `[${level}]` : ''}`, ...args);
}
function printDir(...args: mixed[]) {
  printLog('DIR');
  console.dir(...args);
}
/* eslint-enable no-console */

const logger = {
  log(...args: mixed[]) {
    this.debug(...args);
  },
  debug(...args: mixed[]) {
    printLog('DEBUG', ...args);
  },
  dir(...args: mixed[]) {
    printDir(...args);
  },
  info(...args: mixed[]) {
    printLog('INFO', ...args);
  },
  warn(...args: mixed[]) {
    printWarn('WARN', ...args);
  },
  error(...args: mixed[]) {
    printError('ERROR', ...args);
  },
};

export default logger;
