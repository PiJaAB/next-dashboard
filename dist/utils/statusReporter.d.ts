/// <reference types="node" />
import EventEmitter from 'events';
import { SiteMessageType } from './types';
export declare const statusEventEmitter: EventEmitter;
declare class StatusReporter {
    constructor();
    timeout: NodeJS.Timeout | number | null;
    cache: {
        resolve: (res: boolean) => void;
        err: Error | SiteMessageType;
    }[];
    report(err: Error | SiteMessageType): Promise<boolean>;
}
declare const _default: StatusReporter;
export default _default;
