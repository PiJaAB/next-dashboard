// @flow
import type { DataType } from './types';

export function refineToValue(data: DataType): mixed {
  if (data == null) throw new RangeError('Data is undefined');
  if (data.status !== 'success') return data.status;
  return data.value;
}

type RefineDataToPrimitiveFn = {
  (DataType, 'string'): string,
  (DataType, 'number'): number,
  (DataType, 'boolean'): boolean,
  (DataType, 'object'): {| +[string]: mixed |},
  (DataType, 'array'): $ReadOnlyArray<mixed>,
  (DataType, 'undefined'): void,
};

type RefineToPrimitiveFn = {
  (mixed, 'string'): string,
  (mixed, 'number'): number,
  (mixed, 'boolean'): boolean,
  (mixed, 'object'): {| +[string]: mixed |},
  (mixed, 'array'): $ReadOnlyArray<mixed>,
  (mixed, 'undefined'): void,
};

export const refineToPrimitive: RefineToPrimitiveFn = (value, type) => {
  if (type === 'string' && typeof value === 'string') {
    return (value /*:any */);
  }
  if (type === 'number' && typeof value === 'number') {
    return (value /*:any */);
  }
  if (type === 'boolean' && typeof value === 'boolean') {
    return (value /*:any */);
  }
  if (type === 'undefined' && typeof value === 'undefined') {
    return (value /*:any */);
  }
  if (
    type === 'object' &&
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return (value /*:any */);
  }
  if (type === 'array' && Array.isArray(value)) {
    return (value /*:any */);
  }
  throw new TypeError(
    `Expected ${type}, got ${Array.isArray(value) ? 'array' : typeof value}`,
  );
};

export const refineDataToPrimitive: RefineDataToPrimitiveFn = (data, type) => {
  return (refineToPrimitive(refineToValue(data), type) /*:any*/);
};
