import { DataExtra } from './types';

export default function generateDataKey<Data extends {}, DS extends keyof Data>(
  dataSource: DS,
  extra?: DataExtra,
): DS {
  if (extra != null) {
    return `${dataSource}(${JSON.stringify(extra)})` as DS;
  }
  return dataSource;
}
