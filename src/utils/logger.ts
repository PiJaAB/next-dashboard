/* eslint-disable no-console */
function printLog(level?: string, ...args: unknown[]) {
  console.log(`[NEXT-DASHBOARD]${level ? `[${level}]` : ''}`, ...args);
}
function printWarn(level?: string, ...args: unknown[]) {
  console.warn(`[NEXT-DASHBOARD]${level ? `[${level}]` : ''}`, ...args);
}
function printError(level?: string, ...args: unknown[]) {
  console.error(`[NEXT-DASHBOARD]${level ? `[${level}]` : ''}`, ...args);
}
function printDir(...args: unknown[]) {
  printLog('DIR');
  console.dir(...args);
}
/* eslint-enable no-console */

const logger = {
  log(...args: unknown[]): void {
    this.debug(...args);
  },
  debug(...args: unknown[]): void {
    printLog('DEBUG', ...args);
  },
  dir(...args: unknown[]): void {
    printDir(...args);
  },
  info(...args: unknown[]): void {
    printLog('INFO', ...args);
  },
  warn(...args: unknown[]): void {
    printWarn('WARN', ...args);
  },
  error(...args: unknown[]): void {
    printError('ERROR', ...args);
  },
};

export default logger;
