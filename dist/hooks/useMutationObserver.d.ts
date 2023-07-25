type Callback = (records: MutationRecord[], observer: MutationObserver) => void;
export default function useMutationObserver(target?: Node, options?: MutationObserverInit, callback?: Callback): void;
export {};
