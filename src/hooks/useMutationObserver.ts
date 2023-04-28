import { useMemo, useEffect } from 'react';

type Callback = (records: MutationRecord[], observer: MutationObserver) => void;

export default function useMutationObserver(
  target?: Node,
  options?: MutationObserverInit,
  callback?: Callback,
): void {
  const observer = useMemo(
    () =>
      typeof window === 'undefined' &&
      callback &&
      new MutationObserver(callback),
    [callback],
  );
  useEffect(() => {
    if (!observer || !target || !options) return undefined;
    observer.observe(target, options);
    return () => {
      observer.disconnect();
    };
  }, [observer, target, options]);
}
