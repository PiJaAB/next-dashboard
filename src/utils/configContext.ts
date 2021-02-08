import React from 'react';
import { Branding, IAuthProvider, Theme } from './types';

class DummyAuthProvider implements IAuthProvider {
  constructor() {
    throw new Error("Can't use ConfigContext without a provider.");
  }

  isAuthenticated(): boolean {
    throw new Error("Can't use ConfigContext without a provider.");
  }

  isAuthorizedForRoute(): boolean {
    throw new Error("Can't use ConfigContext without a provider.");
  }

  serialize(): string {
    throw new Error("Can't use ConfigContext without a provider.");
  }
}

export const defaultContext = {
  AuthProvider: DummyAuthProvider as {
    new (): IAuthProvider;
  },
  branding: {
    name: 'PiJa Next',
  } as Branding,
  themes: [
    { name: 'Light', class: 'default' },
    { name: 'Dark', class: 'dark' },
  ] as readonly Theme[],
};

type DefaultConfig = typeof defaultContext;

export type FullConfig = DefaultConfig;

type RequiredConf = 'AuthProvider';

export type Config = Partial<Omit<FullConfig, RequiredConf>> &
  Pick<FullConfig, RequiredConf>;

export function buildConfigContext(conf: Config): FullConfig {
  return {
    ...defaultContext,
    ...conf,
  };
}

const ConfigContext = React.createContext<FullConfig>(defaultContext);

ConfigContext.displayName = 'ConfigContext';
export default ConfigContext;
