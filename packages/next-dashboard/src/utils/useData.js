// @flow

import { useContext, useEffect } from 'react';

import DashboardContext, {
  type DashboardContextType,
} from './dashboardContext';
import type { MappedData, DataExtra } from './types';
import generateDataKey from './generateDataKey';

function useData<Data: {}>(
  dataSource: $Keys<Data>,
  extra?: DataExtra,
): MappedData<Data> {
  const ctx = useContext<DashboardContextType<Data>>(DashboardContext);
  if (!ctx) throw TypeError('Cannot get data without a context');

  useEffect(() => {
    ctx.dataProvider.listen(dataSource, extra);
    return () => {
      ctx.dataProvider.unListen(dataSource, extra);
    };
  }, [dataSource, extra]);

  const dataKey = generateDataKey(dataSource, extra);
  const { data } = ctx;

  if (data[dataKey] == null) {
    return {
      ...data,
      [dataKey]: {
        status: 'loading',
      },
    };
  }

  return data;
}

export default useData;
