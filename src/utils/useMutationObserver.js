// @flow
import { useMemo, useEffect } from 'react';

type Callback = (MutationRecord[], MutationObserver) => void;

const callbacks = new WeakMap<MutationObserver, Callback>();

const gcb = (records, observer) => {
  const callback = callbacks.get(observer);
  return callback && callback(records, observer);
};

export default function useMutationObserver(
  target: ?Node,
  options: MutationObserverInit | void | null,
  callback: ?Callback,
) {
  if (typeof window === 'undefined') return;
  const observer = useMemo(() => new MutationObserver(gcb));
  useEffect(() => {
    return () => {
      callbacks.delete(observer);
    };
  }, [observer]);
  useEffect(() => {
    if (!target || !options) return undefined;
    // $FlowIssue: I blame flow.
    observer.observe(target, options);
    return () => {
      observer.disconnect();
    };
  }, [observer, target, options]);
  useEffect(() => {
    if (!callback) callbacks.delete(observer);
    else callbacks.set(observer, callback);
  }, [callback, observer]);
}
