// @flow

import { useState, useEffect } from 'react';
import type {
  IDataContext,
  MappedData,
  DataExtra,
} from '@pija-ab/next-dashboard';

import provider, { type Data, type Identity } from 'src/utils/dataProvider';

const dataContext: IDataContext<Data> = {
  read<DS: $Keys<Data>>(
    dataSource: DS,
    extra?: DataExtra,
  ): $ElementType<MappedData<Data>, DS> {
    return provider.read(dataSource, extra);
  },

  subscribe<DS: $Keys<Data>>(
    cb: ($ElementType<MappedData<Data>, DS>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ) {
    provider.subscribe<DS>(cb, dataSource, extra);
  },

  unsubscribe<DS: $Keys<Data>>(
    cb: ($ElementType<MappedData<Data>, DS>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ) {
    provider.unsubscribe<DS>(cb, dataSource, extra);
  },
};

function useIdentity(): ?Identity {
  const [identity, setIdentity] = useState(provider.getIdentity());
  useEffect(() => {
    provider.on('newIdentity', setIdentity);
    return () => {
      provider.off('newIdentity', setIdentity);
    };
  });
  return identity;
}

export default dataContext;
export { useIdentity };
