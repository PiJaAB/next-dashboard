import { createContext, useCallback, useContext } from 'react';
import logger from '../utils/logger';
import defaultStrings from '../utils/dashboardStringsEnglish';

const StringsContext = createContext(defaultStrings);
export const StringsProvider = StringsContext.Provider;

export default function useS(): (key: keyof typeof defaultStrings) => string {
  const strings = useContext(StringsContext);
  return useCallback(
    (key) => {
      if (process.env.NODE_ENV === 'development') {
        if (!(key in strings)) logger.warn(`key '${key} is missing in strings`);
      }
      const str = strings[key];
      return str == null ? key : str;
    },
    [strings],
  );
}
