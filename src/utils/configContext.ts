import React from 'react';
import { Branding } from './types';

export const defaultContext = {
  defaultTheme: 'light' as 'light' | 'dark',
  autoDetectTheme: true,
  themeSelect: true,
  branding: {
    name: 'PiJa Next',
  } as Branding,
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
