// @flow
import { useState, useEffect } from 'react';

export default function useInitialFlag(): boolean {
  const [initial, setInitial] = useState(true);
  useEffect(() => {
    setInitial(false);
  }, []);
  return initial;
}
