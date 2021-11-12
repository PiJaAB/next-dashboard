import type { NextComponentType, NextPageContext } from 'next';
import { NextRouter } from 'next/router';
export declare class NotImplementedError extends Error {
    constructor(message?: string);
}
export interface Branding {
    /** Site name */
    name: string;
    /** Array of keywords globally relevant for the site */
    keywords?: string[];
    /** URL to the homepage/index, used e.g. for the logo */
    homepageURL?: string;
    /** Base URL for location of logo images, or map from theme class name to logo URL */
    fullLogoURL?: string | Record<'light' | 'dark', string>;
    squareLogoURL?: string | Record<'light' | 'dark', string>;
}
export interface SiteMessageType {
    title?: string;
    message: string;
    status?: 'info' | 'warning' | 'error' | 'success';
    timer?: number | boolean;
    count?: number;
}
export declare type PathFragment = string | number | (string | number)[];
export declare type DataPath = Record<string, PathFragment> | PathFragment;
export declare type DashboardInitialPropsContext = NextPageContext;
export declare type DashboardComponent<P extends {}, I extends {} = {}> = NextComponentType<DashboardInitialPropsContext, I, P> & {
    url?: string | ((router: NextRouter) => string) | void;
    title?: string | (() => string) | void;
};
