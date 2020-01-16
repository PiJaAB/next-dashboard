// @flow
import type { InitialPropsContext } from './nextTypes';

// eslint-disable-next-line import/prefer-default-export
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
  +value?: void,
|};

export type LoadingDataType = {|
  +status: 'loading',
  +value?: void,
|};

export type DataType<T = mixed> =
  | SuccessDataType<T>
  | ErrorDataType
  | LoadingDataType;

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
  runner: (extra?: DataExtra) => Promise<mixed> | mixed,
  interval?: number | ((extra?: DataExtra) => number | void),
  +id: $Keys<Data>,
};

export type PathFragment = string | number | (string | number)[];

export type DataPath = { +[string]: PathFragment } | PathFragment;

export type DataMapper = <T>(T) => DataType<T>;

export type MappedData<D: {}> = $ObjMap<D, DataMapper>;

export interface IAuthProvider {
  constructor(ctx: InitialPropsContext | string): void;
  serialize(): string;
  emit(string, ...any): boolean;
  on(string, any): IAuthProvider;
  off(string, any): IAuthProvider;
  isAuthorizedForRoute(
    _href: string,
    _asPath: string,
    _query: { [string]: string | void },
  ): boolean;
  isAuthenticated(): boolean;
  deAuth(): void;
  auth<Args: $ReadOnlyArray<*>>(...args: Args): Promise<boolean>;
}

export type DashboardInitialPropsContext = InitialPropsContext & {
  authProvider?: IAuthProvider,
};

export type DashboardComponent<P: {}, I: {} = {}> = React$ComponentType<
  P & I,
> & {
  +getInitialProps?: (ctx: DashboardInitialPropsContext) => Promise<I> | I,
};

export interface ISubscriptionProvider<Data: {}> {
  read<DS: $Keys<Data>>(
    dataSource: DS,
    extra?: DataExtra,
  ): $ElementType<MappedData<Data>, DS>;

  subscribe<DS: $Keys<Data>>(
    cb: ($ElementType<MappedData<Data>, DS>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void;

  unsubscribe<DS: $Keys<Data>>(
    cb: ($ElementType<MappedData<Data>, DS>) => void,
    dataSource: DS,
    extra?: DataExtra,
  ): void;
}
