// @flow
import { useEffect } from 'react';

const useBodyClass = (bodyClass: string) =>
  useEffect(() => {
    const { body } = document;
    if (!body) return undefined;
    body.classList.add(bodyClass);
    return () => {
      body.classList.remove(bodyClass);
    };
  }, []);

export default useBodyClass;
