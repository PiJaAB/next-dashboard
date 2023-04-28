import React, { useMemo } from 'react';

import type { DashboardComponent } from '../utils/types';
import ConfigContext, {
  buildConfigContext,
  Config,
} from '../utils/configContext';
import { DashboardProvider } from '../utils/dashboardContext';
import defaultStrings from '../utils/dashboardStringsEnglish';
import { StringsProvider } from '../hooks/useS';

export default function WithDashboard({
  config,
  strings = defaultStrings,
  children,
}: {
  config: Config;
  strings?: Partial<Record<keyof typeof defaultStrings, string>>;
  children: React.ReactElement<unknown, DashboardComponent<any>>;
}): JSX.Element {
  const configCtx = useMemo(() => buildConfigContext(config), [config]);
  const computedStrings = useMemo(() => {
    if (strings == null) return defaultStrings;
    return {
      ...defaultStrings,
      ...strings,
    };
  }, [strings]);
  return (
    <StringsProvider value={computedStrings}>
      <ConfigContext.Provider value={configCtx}>
        <DashboardProvider>{children}</DashboardProvider>
      </ConfigContext.Provider>
    </StringsProvider>
  );
}
