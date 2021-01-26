// @flow

import React, { useMemo } from 'react';

import type { DashboardComponent } from '../utils/types';
import ConfigContext, {
  buildConfigContext,
  Config,
} from '../utils/configContext';
import { DashboardProvider } from '../utils/dashboardContext';

export default function WithDashboard({
  config,
  children,
}: {
  config: Config;
  children: React.ReactElement<unknown, DashboardComponent<any>>;
}): JSX.Element {
  const { AuthProvider } = config;
  const configCtx = useMemo(() => buildConfigContext(config), [config]);
  return (
    <ConfigContext.Provider value={configCtx}>
      <DashboardProvider AuthProvider={AuthProvider}>
        {children}
      </DashboardProvider>
    </ConfigContext.Provider>
  );
}
