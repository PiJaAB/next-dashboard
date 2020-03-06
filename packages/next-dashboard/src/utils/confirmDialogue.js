// @flow
/*:: import * as R from 'react'; */
import logger from './logger';

export type Options = {
  ok: () => void,
  renderOk?: R.Node | ((confirm: () => void) => R.Node),
  cancel?: () => void,
  renderCancel?: R.Node | ((cancel: () => void) => R.Node),
  title?: string,
  message?: R.Node,
};

let cache: Options[] = [];
let listener: null | {
  onDialogue(Options): void,
  onCancel(Options): void,
} = null;

export function onConfirmDialogue(newListener: typeof listener): Options[] {
  if (listener != null) {
    logger.warn(
      'Tried to register confirm listener when one was already registered',
    );
  }
  listener = newListener;
  if (cache.length === 0) return cache;
  const oldCache = cache;
  cache = [];
  return oldCache;
}

export function offConfirmDialogue(newListener: typeof listener) {
  if (listener === newListener) listener = null;
  else logger.warn("Tried to remove confirm listener that wasn't registered");
}

function cancel(opts: Options) {
  if (listener == null) {
    cache = cache.filter(entry => entry !== opts);
  } else {
    listener.onCancel(opts);
  }
}

export default function confirm(opts: Options): () => void {
  if (listener != null) {
    listener.onDialogue(opts);
    return () => cancel(opts);
  }
  cache.push(opts);
  return () => cancel(opts);
}
