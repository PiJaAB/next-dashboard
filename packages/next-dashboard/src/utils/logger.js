// @flow
/* eslint-disable no-console */

const logger = {
  log(level?: string, ...args: mixed[]) {
    console.log(`[NEXT-DASHBOARD]${level ? `[${level}]` : ''}`, ...args);
  },
  debug(...args: mixed[]) {
    this.log('DEBUG', ...args);
  },
  dir(...args: mixed[]) {
    this.log('DIR');
    console.dir(...args);
  },
  info(...args: mixed[]) {
    this.log('[INFO]', ...args);
  },
  warn(...args: mixed[]) {
    console.warn('[NEXT-DASHBOARD][WARN]', ...args);
  },
  error(...args: mixed[]) {
    console.error('[NEXT-DASHBOARD][WARN]', ...args);
  },
};

export default logger;
