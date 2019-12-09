// @flow

import { useEffect, useState } from 'react';

import type { MappedData, DataExtra, IDataContext } from './types';

function useData<Data: {}, DS: $Keys<Data>>(
  ctx: IDataContext<Data>,
  dataSource: DS,
  extra?: DataExtra,
): $ElementType<MappedData<Data>, DS> {
  const [data, setData] = useState<
    $ElementType<MappedData<Data>, typeof dataSource>,
  >(ctx.read(dataSource, extra));

  useEffect(() => {
    ctx.subscribe(setData, dataSource, extra);
    return () => {
      ctx.unsubscribe(setData, dataSource, extra);
    };
  }, [dataSource, extra]);

  return data;
}

export default useData;
