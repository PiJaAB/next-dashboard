// @flow
import type { DataType } from '@pija-ab/next-dashboard/src/utils/types';

function mapData<T, U>(data: DataType<T>, fn: T => U): DataType<U> {
  if (data.status === 'success') {
    const { value, ...rest } = data;
    return {
      value: fn(value),
      ...rest,
    };
  }
  return data;
}

export default mapData;
