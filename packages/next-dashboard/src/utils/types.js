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
    |}
  | {|
      +status: 'error',
      +error: Error,
    |}
  | {|
      +status: 'loading',
    |}
  | void;

export interface IDataProvider {
  update<T>(key: string, data: T, extra?: mixed): Promise<void> | void;
  getAuthData(): Promise<mixed> | mixed;
  isAuthorizedForRoute(
    href: string,
    asPath: string,
    query: { [string]: string | void },
  ): Promise<boolean> | boolean;
  getCurrentData(): { [string]: DataType };
}

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
