/* eslint-disable @typescript-eslint/ban-types */
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

export interface SuccessData<T = unknown> {
  status: 'success';
  error?: never;
  value: T;
  updating?: boolean;
}

export interface ErrorData {
  status: 'error';
  error: Error;
  value?: never;
  updating?: boolean;
}

export interface LoadingData {
  status: 'loading';
  error?: never;
  value?: never;
  updating?: boolean;
}

export type DataType<T = unknown> = SuccessData<T> | ErrorData | LoadingData;

export interface Branding {
  /** Site name */
  name: string;
  /** Array of keywords globally relevant for the site */
  keywords?: string[];
  /** URL to the homepage/index, used e.g. for the logo */
  homepageURL?: string;
  /** Base URL for location of logo images, or map from theme class name to logo URL */
  logoURL?: string | Record<string, string>;
}

export interface Theme {
  name: string;
  class: string;
}

export interface SiteMessageType {
  title?: string;
  message: string;
  status?: 'info' | 'warning' | 'error';
  count?: number;
}

export type Statuses = 'loading' | 'success' | 'error';

export type DataProps<P extends { status?: Statuses }> = P & {
  status: Statuses;
};

type DataArray = Array<DataExtra>;
type DataRecord = Partial<{ [key: string]: DataExtra }>;

export type DataExtra =
  | DataRecord
  | DataArray
  | number
  | string
  | boolean
  | null;

export type PollingFetcher<Data extends {}> = {
  runner:
    | keyof Data
    | (keyof Data)[]
    | ((extra?: DataExtra) => Promise<unknown> | unknown);
  parser?: (...args: any[]) => any;
  interval?: number | ((extra?: DataExtra) => number | void);
  id: keyof Data;
};

export type PathFragment = string | number | (string | number)[];

export type DataPath = Record<string, PathFragment> | PathFragment;

export interface IAuthProvider {
  serialize(): string;
  isAuthorizedForRoute(
    _href: string,
    _asPath: string,
    _query: Partial<Record<string, string>>,
  ): boolean | symbol | Promise<boolean | symbol>;
  isAuthenticated(): boolean;
  ready?: Promise<unknown> | unknown;
}

export type DashboardInitialPropsContext = NextPageContext & {
  authProvider?: IAuthProvider;
};

export type DashboardComponent<
  P extends {},
  I extends {} = {}
> = NextComponentType<DashboardInitialPropsContext, I, P> & {
  url?: string | ((router: NextRouter) => string) | void;
  title?: string | (() => string) | void;
};

export interface ISubscriptionProvider<Data extends {}> {
  read<DS extends keyof Data>(
    dataSource: DS,
    extra?: DataExtra,
  ): DataType<Data[DS]>;

  subscribe<DS extends keyof Data>(
    cb: (data: DataType<Data[DS]>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void;

  unsubscribe<DS extends keyof Data>(
    cb: (data: DataType<Data[DS]>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void;
}
