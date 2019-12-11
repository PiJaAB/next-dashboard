// @flow

import { useState, useEffect } from 'react';
import { useData } from '@pija-ab/next-dashboard';
import type { DataType } from '@pija-ab/next-dashboard/src/utils/types';

import type { Identity, Customer } from 'src/API/types';
import authProvider from 'src/API/authProvider';
import subscriberProvider from 'src/API/subscriberProvider';
import mapData from './mapData';

function useIdentity(): ?Identity {
  const [identity, setIdentity] = useState(authProvider.identity);
  useEffect(() => {
    authProvider.on('newIdentity', setIdentity);
    return () => {
      authProvider.off('newIdentity', setIdentity);
    };
  });
  return identity;
}

/**
 * Use the CustInfo Customers entry for the currently selected customer.
 * Returns result wrapped as a DataType<Customer> to handle loading & error cases.
 */
const useCurrentCustomerInfo = (): DataType<Customer> => {
  const identity = useIdentity();
  const mkError = message => ({ status: 'error', error: new Error(message) });
  if (identity == null) {
    return mkError('No identity!');
  }
  const custInfo = useData(subscriberProvider, 'customerInfo');
  const matchesCustNo = c => c.CustNo === identity.customerId;
  const res = mapData(custInfo, ({ Customers }) =>
    Customers.find(matchesCustNo),
  );
  if (res.status === 'success' && res.value != null) {
    const { value, ...rest } = res;
    return {
      value,
      ...rest,
    };
  }
  return mkError(`No customerId '${identity.customerId}'`);
};

export { useIdentity, useCurrentCustomerInfo };
