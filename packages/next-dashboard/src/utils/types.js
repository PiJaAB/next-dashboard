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
|};

export type LoadingDataType = {|
  +status: 'loading',
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

export type PollingFetcher = {
  id: string,
  runner(extra?: DataExtra): Promise<mixed> | mixed,
  interval?: number,
};

export type PathFragment = string | number | (string | number)[];

export type DataPath = { +[string]: PathFragment } | PathFragment;

export type DataMapper = <T>(T) => DataType<T>;

export type MappedData<D: {}> = $ObjMap<D, DataMapper>;

export interface IErrorAuthReporter {
  emit(string, ...any): boolean;
  on(string, any): IErrorAuthReporter;
  off(string, any): IErrorAuthReporter;
  +initialize: ?(ctx: InitialPropsContext) => void;
  isAuthorizedForRoute(
    _href: string,
    _asPath: string,
    _query: { [string]: string | void },
  ): boolean;
  isAuthenticated(): boolean;
}

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
