// @flow

import { createContext } from 'react';
import type {
  IDataContext,
  MappedData,
  DataExtra,
} from '@pija-ab/next-dashboard';

import provider, { type Data } from 'src/utils/dataProvider';

interface ICustomContext extends IDataContext<Data> {
  getIdentity(): $Call<$PropertyType<typeof provider, 'getIdentity'>>;
}

const ctx: ICustomContext = {
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

  getIdentity(): $Call<$PropertyType<typeof provider, 'getIdentity'>> {
    return provider.getIdentity();
  },
};

export default createContext<ICustomContext>(ctx);
