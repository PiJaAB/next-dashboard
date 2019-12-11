// @flow
import type { DataType } from '@pija-ab/next-dashboard/src/utils/types';

const wrapToFn0 = <T>(valueOrFn: (() => T) | T): (() => T) =>
  // $FlowIssue
  typeof valueOrFn === 'function' ? valueOrFn : () => valueOrFn;

const wrapToFn1 = <T, U>(valueOrFn: (U => T) | T): (U => T) =>
  // eslint-disable-next-line no-unused-vars, $FlowIssue
  typeof valueOrFn === 'function' ? valueOrFn : _ => valueOrFn;

/**
 * Branch on loading state of `data`, e.g. `readFromData(data, v => v.foo, 'Error!', 'Loading...')`
 */
function readFromData<T, U>(
  data: DataType<T>,
  whenSuccess: (T => U) | U,
  whenError: (() => U) | U,
  whenLoading: (() => U) | U,
): U {
  const whenSuccessFn = wrapToFn1(whenSuccess);
  const whenErrorFn = wrapToFn0(whenError);
  const whenLoadingFn = wrapToFn0(whenLoading);
  if (data.status === 'error') return whenErrorFn();
  if (data.status === 'success') return whenSuccessFn(data.value);
  return whenLoadingFn();
}

export default readFromData;
