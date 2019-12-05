// @flow

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

export type Identity = {
  displayName?: string,
  subName?: string,
  imgUrl?: string,
  authenticated?: boolean,
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
  | boolean;

export type PollingFetcher = {
  id: string,
  runner(extra?: DataExtra): Promise<mixed> | mixed,
  interval?: number,
};

export type PathFragment = string | number | (string | number)[];

export type DataPath = { +[string]: PathFragment } | PathFragment;

export type DataMapper = <T>(T) => DataType<T>;

export type MappedData<D> = $ObjMap<D, DataMapper>;
