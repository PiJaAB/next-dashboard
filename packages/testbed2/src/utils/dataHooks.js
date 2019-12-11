// @flow

import { useState, useEffect } from 'react';
import { useData } from '@pija-ab/next-dashboard';
import type { DataType } from '@pija-ab/next-dashboard/src/utils/types';

import type { Identity, Customer } from 'src/API/types';
import authProvider from 'src/API/authProvider';
import subscriberProvider from 'src/API/subscriberProvider';

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

  if (custInfo.status === 'success') {
    const { Customers } = custInfo.value;
    const customer = Customers.find(matchesCustNo);
    if (customer == null) {
      return mkError(`No customerId '${identity.customerId}'`);
    }
    return { status: 'success', value: customer };
  }

  return custInfo;
};

export { useIdentity, useCurrentCustomerInfo };
