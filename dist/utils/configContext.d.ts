import React from 'react';
import { Branding } from './types';
export declare const defaultContext: {
    defaultTheme: "light" | "dark";
    autoDetectTheme: boolean;
    themeSelect: boolean;
    branding: Branding;
};
declare type DefaultConfig = typeof defaultContext;
export declare type FullConfig = DefaultConfig;
export declare type Config = Partial<FullConfig>;
export declare function buildConfigContext(conf: Config): FullConfig;
declare const ConfigContext: React.Context<{
    defaultTheme: "light" | "dark";
    autoDetectTheme: boolean;
    themeSelect: boolean;
    branding: Branding;
}>;
export default ConfigContext;
