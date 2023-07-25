import { SilentError } from './silentError';
export declare class ConsoleError extends SilentError {
    constructor(error?: Error | string);
}
export declare function makeConsole(error: Error): never;
