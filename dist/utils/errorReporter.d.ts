/// <reference types="node" />
import EventEmitter from 'events';
import { SiteMessageType } from './types';
export declare const errorEventEmitter: EventEmitter;
declare class ErrorReporter {
    constructor();
    timeout: NodeJS.Timeout | number | null;
    cache: {
        resolve: (res: boolean) => void;
        err: Error | SiteMessageType;
    }[];
    report(err: Error | SiteMessageType): Promise<boolean>;
}
declare const _default: ErrorReporter;
export default _default;
