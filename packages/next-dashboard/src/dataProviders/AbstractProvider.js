/* eslint-disable class-methods-use-this */
// @flow
import EventEmitter from 'events';
import { NotImplementedError, type IDataProvider } from '../utils/types';

export default class AbstractProvider extends EventEmitter
  implements IDataProvider {
  getAuthData() {
    throw new NotImplementedError();
  }
}
