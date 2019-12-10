// @flow

import { type PollingFetcher } from '@pija-ab/next-dashboard';
import authProvider from './authProvider';
import type { Overview, CustInfo } from './types';
import axios from './axios';
import sortBy from '../utils/sortBy';

const formatDate = date => {
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  return `${YYYY}-${MM}`;
};

function getOverviewParams(): { from: string, to: string } {
  const date = new Date();
  date.setDate(0);
  const to = formatDate(date);
  date.setDate(0);
  const from = formatDate(date);
  return { to, from };
}

function overviewSort({ periodScores, ...overview }: Overview): Overview {
  const pad5 = str => str.padStart(5, '0');
  const scores = sortBy(periodScores, ({ Period }): string =>
    Period.split(':')
      .map(pad5)
      .join(':'),
  );
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
