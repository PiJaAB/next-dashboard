// @flow
import type { DataType } from './types';

export function refineToValue(data: DataType<>): mixed {
  if (data == null) throw new RangeError('Data is undefined');
  if (data.status !== 'success') return data.status;
  return data.value;
}

type Obj = {|
  +[string]: mixed,
|};

type RefineDataToPrimitiveFn = {
  (DataType<>, 'string'): string,
  (DataType<>, 'number'): number,
  (DataType<>, 'printable'): string | number,
  (DataType<>, 'boolean'): boolean,
  (DataType<>, 'object'): Obj,
  (DataType<>, 'array'): $ReadOnlyArray<mixed>,
  (DataType<>, 'undefined'): void,
};
type RefineToPrimitiveFn = {
  (mixed, 'string'): string,
  (mixed, 'number'): number,
  (mixed, 'printable'): string | number,
  (mixed, 'boolean'): boolean,
  (mixed, 'object'): Obj,
  (mixed, 'array'): $ReadOnlyArray<mixed>,
  (mixed, 'undefined'): void,
};

export const refineToPrimitive: RefineToPrimitiveFn = (value, type) => {
  if (
    (type === 'string' || type === 'printable') &&
    typeof value === 'string'
  ) {
    return (value /*:any */);
  }
  if (
    (type === 'number' || type === 'printable') &&
    typeof value === 'number'
  ) {
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

function recursiveRefinePath(val: mixed, path: (string | number)[]): mixed {
  const cur = path.shift();
  if (typeof cur === 'string') {
    if (typeof val !== 'object' || val === null) {
      throw new TypeError(
        `Expected Object in path resolution, got ${
          val === null ? 'null' : typeof val
        }`,
      );
    }
    if (path.length) {
      return recursiveRefinePath(val[cur], path);
    }
    return val[cur];
  }
  if (!Array.isArray(val)) {
    throw new TypeError(
      `Expected Object in path resolution, got ${
        val === null ? 'null' : typeof val
      }`,
    );
  }
  if (path.length) {
    return recursiveRefinePath(val[cur], path);
  }
  return val[cur];
}

export function refinePath(val: mixed, path: (string | number)[]): mixed {
  return recursiveRefinePath(val, [...path]);
}
