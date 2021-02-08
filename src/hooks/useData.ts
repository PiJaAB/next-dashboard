import { useEffect, useState } from 'react';

import type {
  DataExtra,
  ISubscriptionProvider,
  DataType,
} from '../utils/types';

function useData<Data extends {}, DS extends keyof Data>(
  subProvider: ISubscriptionProvider<Data>,
  dataSource: DS,
  extra?: DataExtra,
  dummy?: boolean,
): DataType<Data[DS]> {
  const [data, setData] = useState<DataType<Data[DS]>>(
    subProvider.read(dataSource, extra),
  );

  useEffect(() => {
    if (dummy) return undefined;
    const curData = subProvider.read(dataSource, extra);
    setData((oldData) => {
      if (curData.status !== oldData.status) {
        return curData;
      }
      if (curData.status === 'success' && curData.value !== oldData.value) {
        return curData;
      }
      return oldData;
    });
    subProvider.subscribe(setData, dataSource, extra);
    return () => {
      subProvider.unsubscribe(setData, dataSource, extra);
    };
  }, [dataSource, dummy, extra, subProvider]);

  return !dummy ? data : { status: 'loading' };
}

export default useData;
