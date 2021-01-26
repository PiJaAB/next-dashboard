import React, { createContext, useContext, useEffect, useState } from 'react';

const initialRenderContext = createContext(true);

export function InitalRenderProvider({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element {
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => {
    setInitialRender(false);
  }, [setInitialRender]);
  return (
    <initialRenderContext.Provider value={initialRender}>
      {children}
    </initialRenderContext.Provider>
  );
}

export default function useInitialRender(): boolean {
  return useContext(initialRenderContext);
}
