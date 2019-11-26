// @flow
export type DataType =
  | {
      status: 'success',
      value: mixed,
    }
  | {
      status: 'error',
      error: Error,
    }
  | {
      status: 'loading',
    }
  | void;

export type DataProvider = {
  update<T>(key: string, data: T, extra?: mixed): Promise<void> | void,
  getAuthData(): Promise<mixed> | mixed,
  isAuthorizedForRoute(
    href: string,
    asPath: string,
    query: { [string]: string | void },
  ): Promise<boolean> | boolean,
  getCurrentData(): { [string]: DataType },
};

export interface IDataProvider {
  update: $PropertyType<DataProvider, 'update'>;
  getAuthData: $PropertyType<DataProvider, 'getAuthData'>;
  isAuthorizedForRoute: $PropertyType<DataProvider, 'isAuthorizedForRoute'>;
  getCurrentData: $PropertyType<DataProvider, 'getCurrentData'>;
  addDataListener(listener: (data: { [string]: DataType }) => void): void;
  removeDataListener(listener: (data: { [string]: DataType }) => void): void;
}

export type Theme = {
  name: string,
  class: string,
};
