import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ReactTooltip from 'react-tooltip';

const context = createContext(() => {});

export function RebuildTooltipProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const [shouldRebuild, setShouldRebuild] = useState(false);
  useEffect(() => {
    if (shouldRebuild) {
      ReactTooltip.rebuild();
      setShouldRebuild(false);
    }
  }, [shouldRebuild]);
  const value = useCallback(() => {
    setShouldRebuild(true);
  }, []);
  return <context.Provider value={value}>{children}</context.Provider>;
}

export default function useRebuildTooltip(): () => void {
  return useContext(context);
}
