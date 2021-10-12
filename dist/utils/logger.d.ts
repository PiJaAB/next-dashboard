declare const logger: {
    log(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    dir(...args: unknown[]): void;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
};
export default logger;
