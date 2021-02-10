import React from 'react';
import { Branding, Theme } from './types';

export const defaultContext = {
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

export type Config = Partial<FullConfig>;

export function buildConfigContext(conf: Config): FullConfig {
  return {
    ...defaultContext,
    ...conf,
  };
}

const ConfigContext = React.createContext<FullConfig>(defaultContext);

ConfigContext.displayName = 'ConfigContext';
export default ConfigContext;
