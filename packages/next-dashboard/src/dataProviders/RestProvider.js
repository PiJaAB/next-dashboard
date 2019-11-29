// @flow
import AbstractProvider from './AbstractProvider';
import type { DataType } from '../utils/types';

type Updators = {
  [string]:
    | ((data: mixed, key: string, extra?: mixed) => Promise<void> | void)
    | void,
};

export default class RestSource extends AbstractProvider {
  data: { [string]: DataType };

  updators: Updators = {};

  dataListeners: ((data: { [string]: DataType }) => void)[] = [];

  update = (key, data, extra) => {
    const sender = this.updators[key];
    if (!sender) throw new Error(`No sender registered for key ${key}`);
    return sender(data, key, extra);
  };

  getAuthData = () => ({});

  isAuthorizedForRoute = () => Boolean(this.getAuthData());

  getCurrentData = () => {
    return this.data;
  };

  addDataListener = (listener: (data: { [string]: DataType }) => void) => {
    this.dataListeners.push(listener);
  };

  removeDataListener = (listener: (data: { [string]: DataType }) => void) => {
    const index = this.dataListeners.findIndex(l => l === listener);
    if (index < 0) return;
    this.dataListeners.splice(index, 1);
  };

  setData = (data: { [string]: DataType }, replace: boolean | void) => {
    if (replace) {
      this.data = data;
    } else {
      const keys = Object.keys(data);
      keys.forEach(key => {
        this.data[key] = data[key];
      });
    }
    this.dataListeners.forEach(listener => listener(this.data));
  };
}
