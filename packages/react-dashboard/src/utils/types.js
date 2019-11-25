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
  update<T>(key: string, data: T, extra: { [string]: mixed }): Promise<void>,
  isAuthenticated(): Promise<boolean> | boolean,
};
