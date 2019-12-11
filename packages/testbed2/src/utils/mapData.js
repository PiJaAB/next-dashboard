// @flow
import type { DataType } from '@pija-ab/next-dashboard/src/utils/types';

function mapData<T, U>(data: DataType<T>, fn: T => U): DataType<U> {
  if (data.status === 'success') {
    return {
      status: 'success',
      value: fn(data.value),
    };
  }
  return data;
}
export default mapData;
