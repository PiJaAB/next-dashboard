// @flow

import { useState, useEffect } from 'react';

import { type Identity } from 'src/API/types';
import authProvider from 'src/API/authProvider';

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

// eslint-disable-next-line import/prefer-default-export
export { useIdentity };
