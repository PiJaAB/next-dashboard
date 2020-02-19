// @flow
import React from 'react';

// Types used in comment-notation syntax
// Some editors freak out if not using comment-notation for typecasting.
/*:: import type { Branding, Theme, IAuthProvider } from './types';*/
import type { NextComponent } from './nextTypes';

class DummyAuthProvider implements IAuthProvider {
  constructor() {
    throw new Error("Can't use ConfigContext without a provider.");
  }

  isAuthenticated() {
    throw new Error("Can't use ConfigContext without a provider.");
  }

  isAuthorizedForRoute() {
    throw new Error("Can't use ConfigContext without a provider.");
  }

  serialize() {
    throw new Error("Can't use ConfigContext without a provider.");
  }
}

export const defaultContext = {
  AuthProvider: (DummyAuthProvider /*: Class<IAuthProvider>*/),
  branding: ({
    name: 'PiJa Next',
  } /*: Branding*/),
  themes: ([
    { name: 'Light', class: 'default' },
    { name: 'Dark', class: 'dark' },
  ] /*: $ReadOnlyArray<Theme>*/),
  needAuthDefault: false,
};

export type FullConfig = {
  ...typeof defaultContext,
  unauthedRoute?: string,
  ClientAuthComp?: React$ComponentType<any>,
  error?: {
    Component:
      | (React$ComponentType<any> & { +getInitialProps: void })
      | NextComponent<any>,
    withContext?: boolean,
  },
};

type RequiredConf = {
  AuthProvider: $PropertyType<FullConfig, 'AuthProvider'>,
};

export type Config = $Shape<FullConfig> & RequiredConf;

export function buildConfigContext(conf: Config): FullConfig {
  return {
    ...defaultContext,
    ...conf,
  };
}

const ConfigContext = React.createContext<FullConfig>(defaultContext);

ConfigContext.displayName = 'ConfigContext';
export default ConfigContext;
