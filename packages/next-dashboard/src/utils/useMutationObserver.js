// @flow
import { useState, useEffect } from 'react';

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
  const [observer] = useState(new MutationObserver(gcb));
  useEffect(() => {
    if (!target || !options) return undefined;
    // $FlowIssue: I blame flow.
    observer.observe(target, options);
    return () => {
      observer.disconnect();
    };
  }, [target, options]);
  useEffect(() => {
    if (!callback) callbacks.delete(observer);
    else callbacks.set(observer, callback);
  }, [callback]);
}
