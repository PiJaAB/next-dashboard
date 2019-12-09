// @flow
import {
  PollingProvider,
  createPersistentState,
  type PollingFetcher,
  type IErrorAuthReporter,
} from '@pija-ab/next-dashboard';

import type { InitialPropsContext } from 'src/utils/nextTypes';
import Axios from 'axios';

const { getInitialState, persist } = createPersistentState('dashboardIdentity');

type Identity = {
  username: string,
  accessToken: string,
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

type CustInfo = {
  customerName: string,
  CustNo: string,
  Summary: string,
  PrognoseInfo: string,
  CustomerContacts: string,
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
  {
    id: 'customerInfo',
    async runner(): Promise<Overview> {
      const self = (this /*:XzaktProvider*/);
      return (await self.axios.get(`/Xvision/CustInfo`)).data;
    },
  },
];

export type Data = {|
  overview: Overview,
  customerInfo: CustInfo,
|};

type Fetch = {
  ApiToken: string,
  AuthUsername: string,
};
export class XzaktProvider extends PollingProvider<Data>
  implements IErrorAuthReporter {
  axios = Axios.create({
    baseURL: 'https://api.xzakt.com/api/',
  });

  identity: ?Identity = null;

  initialize(ctx: InitialPropsContext) {
    this.identity = getInitialState(ctx);
    this.refreshAuth();
  }

  constructor() {
    super();
    this.addFetcher(fetchers);
  }

  refreshAuth() {
    const { identity, axios } = this;
    if (!identity) {
      delete axios.defaults.headers.common.AccessToken;
    } else {
      axios.defaults.headers.common.AccessToken = identity.accessToken;
    }
  }

  getIdentity(): ?Identity {
    return this.identity;
  }

  setIdentity(identity: ?Identity) {
    this.identity = identity;
    this.refreshAuth();
    persist(identity);
  }

  isAuthenticated(): boolean {
    return Boolean(this.getIdentity());
  }

  isAuthorizedForRoute(): boolean {
    return Boolean(this.getIdentity());
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

export default new XzaktProvider();
