/// <reference types="node" />
import EventEmitter from 'events';
export declare const errorEventEmitter: EventEmitter;
declare class ErrorReporter {
    constructor();
    cache: {
        resolve: (res: boolean) => void;
        err: Error;
    }[];
    report(err: Error): Promise<boolean>;
}
declare const _default: ErrorReporter;
export default _default;
