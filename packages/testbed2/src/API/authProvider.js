// @flow

import {
  type IErrorAuthReporter,
  type PersistentState,
  createPersistentState,
} from '@pija-ab/next-dashboard';

import EventEmitter from 'events';

import type { InitialPropsContext } from 'src/utils/nextTypes';
import type { Fetch, Identity } from './types';

import axios from './axios';

export class AuthProvider extends EventEmitter implements IErrorAuthReporter {
  identity: ?Identity = undefined;

  constructor() {
    super();
    const { getInitialState, persist } = createPersistentState(
      'xzaktIdentity',
      this,
    );
    this.getInitialState = getInitialState;
    this.persist = persist;
  }

  +getInitialState: InitialPropsContext => PersistentState;

  +persist: PersistentState => void;

  refreshAuth() {
    if (!this.identity) {
      delete axios.defaults.headers.common.AccessToken;
    } else {
      axios.defaults.headers.common.AccessToken = this.identity.accessToken;
    }
  }

  initialize = (ctx: InitialPropsContext) => {
    this.identity = this.getInitialState(ctx);
    this.refreshAuth();
    this.emit('newIdentity', this.identity);
  };

  isAuthorizedForRoute(): boolean {
    return Boolean(this.identity);
  }

  isAuthenticated(): boolean {
    return Boolean(this.identity);
  }

  setIdentity(identity: ?Identity) {
    this.identity = identity;
    this.refreshAuth();
    this.emit('newIdentity', identity);
    this.persist(identity);
  }

  async auth(username: string, password: string): Promise<boolean> {
    const { ApiToken, AuthUsername }: Fetch = (
      await axios.post('Token/Fetch', {
        username,
        password,
      })
    ).data;
    const { CustNo }: { CustNo: string } = (
      await axios.get('Xvision/CustInfo', {
        headers: {
          AccessToken: ApiToken,
        },
      })
    ).data;
    this.setIdentity({
      username: AuthUsername,
      accessToken: ApiToken,
      customerId: CustNo,
    });
    return true;
  }
}

export default new AuthProvider();
