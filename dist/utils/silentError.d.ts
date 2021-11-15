export declare class SilentError extends Error {
    constructor(error?: Error | string);
}
export declare function makeSilent(error: Error): never;
