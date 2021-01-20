// @flow

import type { DataExtra } from './types';

export default function generateDataKey(
  dataSource: string,
  extra?: DataExtra,
): string {
  if (extra != null) {
    return `${dataSource}(${JSON.stringify(extra)})`;
  }
  return dataSource;
}
