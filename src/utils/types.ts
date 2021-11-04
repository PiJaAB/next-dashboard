import type { NextComponentType, NextPageContext } from 'next';
import { NextRouter } from 'next/router';

export class NotImplementedError extends Error {
  constructor(message?: string) {
    let realMessage;
    try {
      const sender = new Error().stack?.split('\n')[2].replace(' at ', '');
      realMessage = `The method ${
        sender || 'UNKNOWN_METHOD'
      } isn't implemented.${message ? `\nMessage: ${message}` : ''}`;
    } catch (_) {
      realMessage = message || 'Function not implemented.';
    }
    super(realMessage);
    this.name = 'NotImplementedError';
  }
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
  status?: 'info' | 'warning' | 'error';
  count?: number;
}

export type PathFragment = string | number | (string | number)[];

export type DataPath = Record<string, PathFragment> | PathFragment;

export type DashboardInitialPropsContext = NextPageContext;

export type DashboardComponent<
  P extends {},
  I extends {} = {},
> = NextComponentType<DashboardInitialPropsContext, I, P> & {
  url?: string | ((router: NextRouter) => string) | void;
  title?: string | (() => string) | void;
};
