// @flow

import { useEffect, useState } from 'react';

import type { DataExtra, ISubscriptionProvider, DataType } from './types';

function useData<Data: {}, DS: $Keys<Data>>(
  subProvider: ISubscriptionProvider<Data>,
  dataSource: DS,
  extra?: DataExtra,
  dummy?: boolean,
): DataType<$ElementType<Data, DS>> {
  const [data, setData] = useState<
    DataType<$ElementType<Data, typeof dataSource>>,
  >(subProvider.read(dataSource, extra));

  useEffect(() => {
    if (dummy) return undefined;
    const curData = subProvider.read(dataSource, extra);
    if (curData.status !== data.status) {
      setData(curData);
    } else if (curData.status === 'success' && curData.value !== data.value) {
      setData(curData);
    }
    subProvider.subscribe(setData, dataSource, extra);
    return () => {
      subProvider.unsubscribe(setData, dataSource, extra);
    };
  }, [dataSource, extra]);

  return data;
}

export default useData;
