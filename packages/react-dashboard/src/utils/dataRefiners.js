// @flow
import type { DataType } from './types';

export function refineToValue(data: DataType): mixed {
  if (data == null) throw new RangeError('Data is undefined');
  if (data.status !== 'success') return data.status;
  return data.value;
}

type RefineToPrimitiveFn = {
  (DataType, 'string'): string,
  (DataType, 'number'): number,
  (DataType, 'boolean'): boolean,
  (DataType, 'undefined'): void,
};

export const refineToPrimitive: RefineToPrimitiveFn = (data, type) => {
  const value = refineToValue(data);
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
  throw new TypeError(`Expected ${type}, got ${typeof value}`);
};
