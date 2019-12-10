// @flow

import { useEffect, useState } from 'react';

import type { MappedData, DataExtra, ISubscriptionProvider } from './types';

function useData<Data: {}, DS: $Keys<Data>>(
  subProvider: ISubscriptionProvider<Data>,
  dataSource: DS,
  extra?: DataExtra,
): $ElementType<MappedData<Data>, DS> {
  const [data, setData] = useState<
    $ElementType<MappedData<Data>, typeof dataSource>,
  >(subProvider.read(dataSource, extra));

  useEffect(() => {
    subProvider.subscribe(setData, dataSource, extra);
    return () => {
      subProvider.unsubscribe(setData, dataSource, extra);
    };
  }, [dataSource, extra]);

  return data;
}

export default useData;
