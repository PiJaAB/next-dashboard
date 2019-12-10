// @flow

import { type PollingFetcher } from '@pija-ab/next-dashboard';
import authProvider from './authProvider';
import type { Overview, CustInfo } from './types';
import axios from './axios';

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

export default ([
  {
    id: 'overview',
    async runner(): Promise<Overview> {
      const { identity } = authProvider;
      if (!identity) {
        throw new Error('Error fetching overview, not authenticated');
      }
      const { customerId } = identity;
      const { from, to } = getOverviewParams();
      return overviewSort(
        (
          await axios.get(
            `/Xvision/OverviewScoresGraph/${customerId}/${from}/${to}/2`,
          )
        ).data,
      );
    },
  },
  {
    id: 'customerInfo',
    async runner(): Promise<CustInfo> {
      return (await axios.get(`/Xvision/CustInfo`)).data;
    },
  },
]: PollingFetcher[]);
