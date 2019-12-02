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

export type DataType =
  | {|
      +status: 'success',
      +value: mixed,
      +updating?: boolean,
    |}
  | {|
      +status: 'error',
      +error: Error,
      +errorLogged?: boolean,
    |}
  | {|
      +status: 'loading',
    |}
  | void;

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
