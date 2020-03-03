// @flow
/*:: import * as R from 'react'; */
import type { InitialPropsContext } from './nextTypes';

export class NotImplementedError extends Error {
  constructor(message?: string) {
    let realMessage;
    try {
      const sender = new Error().stack.split('\n')[2].replace(' at ', '');
      realMessage = `The method ${sender} isn't implemented.${
        message ? `\nMessage: ${message}` : ''
      }`;
    } catch (_) {
      realMessage = message || 'Function not implemented.';
    }
    super(realMessage);
  }

  name = 'NotImplementedError';
}

export type SuccessDataType<T = mixed> = {|
  +status: 'success',
  +value: T,
  +updating?: boolean,
|};

export type ErrorDataType = {|
  +status: 'error',
  +error: Error,
  +value?: empty,
  +updating?: boolean,
|};

export type LoadingDataType = {|
  +status: 'loading',
  +value?: empty,
|};

export type DataType<T = mixed> =
  | SuccessDataType<T>
  | ErrorDataType
  | LoadingDataType;

export type Branding = {
  /** Site name */
  +name: string,
  /** Array of keywords globally relevant for the site */
  +keywords?: string[],
  /** URL to the homepage/index, used e.g. for the logo */
  +homepageURL?: string,
  /** Base URL for location of logo images, or map from theme class name to logo URL */
  +logoURL?: string | { [string]: string },
};

export type Theme = {
  name: string,
  class: string,
};

export type SiteMessageType = {
  +title?: string,
  +message: string,
  +status?: 'info' | 'warning' | 'error',
  +count?: number,
};

export type Statuses = 'loading' | 'success' | 'error';

export type DataProps<P: { status?: Statuses }> = {
  ...$Diff<P, { status?: Statuses }>,
  status: Statuses,
};

export type DataExtra =
  | {
      +[string]: ?DataExtra,
    }
  | $ReadOnlyArray<DataExtra>
  | number
  | string
  | boolean
  | null;

export type PollingFetcher<+Data: {}> = {
  +runner:
    | $Keys<Data>
    | $ReadOnlyArray<$Keys<Data>>
    | ((extra?: DataExtra) => Promise<mixed> | mixed),
  +parser?: (...any) => any,
  +interval?: number | ((extra?: DataExtra) => number | void),
  +id: $Keys<Data>,
};

export type PathFragment = string | number | (string | number)[];

export type DataPath = { +[string]: PathFragment } | PathFragment;

export interface IAuthProvider {
  constructor(ctx: InitialPropsContext | string): void;
  serialize(): string;
  isAuthorizedForRoute(
    _href: string,
    _asPath: string,
    _query: { [string]: string | void },
  ): boolean | Symbol | Promise<boolean | Symbol>;
  isAuthenticated(): boolean;
  +ready?: Promise<mixed> | mixed;
}

export type DashboardInitialPropsContext = InitialPropsContext & {
  authProvider?: IAuthProvider,
};

type DashboardComponentStatics = {
  title?: string,
  url?: string,
};

export type DashboardComponent<P: {}, I: {} = {}> = R.ComponentType<P & I> & {
  +getInitialProps?: (ctx: DashboardInitialPropsContext) => Promise<I> | I,
} & DashboardComponentStatics;

export interface ISubscriptionProvider<Data: {}> {
  read<DS: $Keys<Data>>(
    dataSource: DS,
    extra?: DataExtra,
  ): DataType<$ElementType<Data, DS>>;

  subscribe<DS: $Keys<Data>>(
    cb: (DataType<$ElementType<Data, DS>>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void;

  unsubscribe<DS: $Keys<Data>>(
    cb: (DataType<$ElementType<Data, DS>>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void;
}

export type ArrayType<Q> = $Call<<T>($ReadOnlyArray<T>) => T, Q>;
