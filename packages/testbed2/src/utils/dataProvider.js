// @flow
import {
  PollingProvider,
  createPersistentState,
  type Identity,
  type PollingFetcher,
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

function getOverviewParams(): { from: string, to: string } {
  const date = new Date();
  date.setDate(0);
  const to = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}`;
  date.setDate(0);
  const from = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}`;
  return { to, from };
}

export type Scores = {|
  Volume: number,
  Quality: number,
  Resources: number,
  Leadership: number,
  Average: number,
|};

export type ScoresObj = {|
  Period: string,
  ...Scores,
|};

type Overview = {
  periodScores: ScoresObj[],
  totalScore: ScoresObj,
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

const fetchers: PollingFetcher[] = [
  {
    id: 'overview',
    async runner(): Promise<Overview> {
      const self = (this /*:XzaktProvider*/);
      const { identity } = self;
      if (!identity) {
        throw new Error('Error fetching overview, not authenticated');
      }
      const { customerId } = identity;
      const { from, to } = getOverviewParams();
      return overviewSort(
        (
          await self.axios.get(
            `/Xvision/OverviewScoresGraph/${customerId}/${from}/${to}/2`,
          )
        ).data,
      );
    },
  },
];

export type Data = {
  overview: Overview,
};

type Fetch = {
  ApiToken: string,
  AuthUsername: string,
};
export default class XzaktProvider extends PollingProvider<Data> {
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
    this.addFetcher(fetchers);
  }

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
    const { ApiToken, AuthUsername }: Fetch = (
      await axios.post('Token/Fetch', {
        username,
        password,
      })
    ).data;
    const { customerName, CustNo }: { customerName: string, CustNo: string } = (
      await axios.get('Xvision/CustInfo', {
        headers: {
          AccessToken: ApiToken,
        },
      })
    ).data;
    this.setIdentity({
      username: AuthUsername,
      accessToken: ApiToken,
      customer: customerName,
      customerId: CustNo,
    });
    return true;
  }
}
