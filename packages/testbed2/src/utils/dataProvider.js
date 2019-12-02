// @flow
import {
  AbstractProvider,
  createPersistentState,
  type Identity,
} from '@pija-ab/next-dashboard';

import type { InitialPropsContext } from 'src/utils/nextTypes';
import Axios from 'axios';

const { getInitialState, persist } = createPersistentState('dashboardIdentity');

type XzaktIdentity = {
  username: string,
  accessToken: string,
  customer: string,
  customerId: string,
};

/*
  Remember after weekend:
  Usernames are case insensitive, API does not give a source-of-truth for usernames.
  we do get a customerName, uncertain what relation that has to username
  customerName: FORA
  username: FORA_user1


*/

function getLastMonth(): { from: string, to: string, dayCount: number } {
  const date = new Date();
  date.setDate(0);
  const dayCount = date.getDate();
  const to = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
  date.setDate(1);
  const from = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
  return { to, from, dayCount };
}

type DataFetcher = {
  id: string | string[],
  // eslint-disable-next-line no-use-before-define
  runner(XzaktProvider): Promise<void> | void,
  interval?: number,
  maxAge?: number,
};

type Scores = {
  Period: string,
  Volume: number,
  Quality: number,
  Resources: number,
  Leadership: number,
  Average: number,
};

type Overview = {
  periodScores: Scores[],
  totalScore: Scores,
};

function overviewSort({ periodScores, ...overview }: Overview): Overview {
  const scores = periodScores.sort(({ Period: P1 }, { Period: P2 }) => {
    const p1 = P1.split(':')
      .map(s => s.padStart(5, '0'))
      .join(':');
    const p2 = P2.split(':')
      .map(s => s.padStart(5, '0'))
      .join(':');
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
    return 0;
  });
  return {
    ...overview,
    periodScores: scores,
  };
}

const fetchers: DataFetcher[] = [
  {
    id: 'overview',
    // eslint-disable-next-line no-use-before-define
    async runner(self: XzaktProvider) {
      const { identity } = self;
      if (!identity) {
        self.mutate({
          leadership: {
            status: 'error',
            error: new Error('Missing identity for data fetching'),
          },
        });
        return;
      }
      const { customerId } = identity;
      const { from, to } = getLastMonth();
      try {
        const overview = overviewSort(
          (
            await self.axios.get(
              `/Xvision/OverviewScoresGraph/${customerId}/${from}/${to}/1`,
            )
          ).data,
        );
        self.mutate({
          overview: {
            status: 'success',
            value: overview,
          },
        });
      } catch (err) {
        self.mutate({
          leadership: {
            status: 'error',
            error: err,
          },
        });
      }
    },
    interval: 10,
  },
];

export default class XzaktProvider extends AbstractProvider {
  axios = Axios.create({
    baseURL: 'https://api.xzakt.com/api/',
  });

  identity: ?XzaktIdentity = null;

  initialize(ctx: InitialPropsContext) {
    this.identity = getInitialState(ctx);
    this.refreshAuth();
  }

  constructor() {
    super();
    this.on('listen', this.newListener);
    this.on('unListen', id => console.log('UNLISTEN:', id));
  }

  newListener: string => void = id => {
    const fetcher = fetchers.find(curFetcher =>
      typeof curFetcher.id === 'object'
        ? curFetcher.id.includes(id)
        : id === curFetcher.id,
    );
    if (!fetcher) {
      this.mutate({
        [id]: {
          error: new Error(`No datafetcher registered for id '${id}'`),
          status: 'error',
        },
      });
    } else {
      fetcher.runner(this);
    }
  };

  getIdentity(): ?Identity {
    if (this.identity == null) return null;
    const { username, customer } = this.identity;
    return {
      authenticated: true,
      displayName: username,
      subName: customer,
    };
  }

  refreshAuth() {
    const { identity, axios } = this;
    if (!identity) {
      delete axios.defaults.headers.common.AccessToken;
    } else {
      axios.defaults.headers.common.AccessToken = identity.accessToken;
    }
  }

  setIdentity(identity: ?XzaktIdentity) {
    this.identity = identity;
    this.refreshAuth();
    persist(identity);
  }

  async auth(username: string, password: string): Promise<boolean> {
    const { axios } = this;
    const token: string = (
      await axios.post('Token/Fetch', {
        username,
        password,
      })
    ).data.ApiToken;
    const { customerName, CustNo }: { customerName: string, CustNo: string } = (
      await axios.get('Xvision/CustInfo', {
        headers: {
          AccessToken: token,
        },
      })
    ).data;
    this.setIdentity({
      username,
      accessToken: token,
      customer: customerName,
      customerId: CustNo,
    });
    return true;
  }
}
