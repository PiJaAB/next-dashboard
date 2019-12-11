// @flow

import { type PollingFetcher, type DataExtra } from '@pija-ab/next-dashboard';
import authProvider from './authProvider';
import type { Overview, CustInfo } from './types';
import axios from './axios';
import sortBy from '../utils/sortBy';

const formatDate = date => {
  const YYYY = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  return `${YYYY}-${MM}`;
};

function getOverviewParams(
  inputDate?: DataExtra,
): { from: string, to: string } {
  if (inputDate != null && typeof inputDate !== 'string')
    throw new TypeError('Expected date to be of type string if specified');
  const date = inputDate == null ? new Date() : new Date(inputDate);
  date.setDate(0);
  const to = formatDate(date);
  date.setDate(0);
  const from = formatDate(date);
  return { to, from };
}

function overviewSort({ PeriodScores, ...overview }: Overview): Overview {
  const pad5 = str => str.padStart(5, '0');
  const scores = sortBy(PeriodScores, ({ Period }): string =>
    Period.split(':')
      .map(pad5)
      .join(':'),
  );
  return {
    ...overview,
    PeriodScores: scores,
  };
}

export default ([
  {
    id: 'overview',
    async runner(extra?: DataExtra): Promise<Overview> {
      const { identity } = authProvider;
      if (!identity) {
        throw new Error('Error fetching overview, not authenticated');
      }
      const { customerId } = identity;
      const { from, to } = getOverviewParams(extra);
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
    id: 'overviewChart',
    async runner(extra?: DataExtra): Promise<Overview> {
      const { identity } = authProvider;
      if (!identity) {
        throw new Error('Error fetching overview, not authenticated');
      }
      if (!extra || typeof extra !== 'object' || Array.isArray(extra)) {
        throw new TypeError('Expected object as extra');
      }
      const { customerId } = identity;
      const { from, to } = extra;
      if (typeof from !== 'string' || typeof to !== 'string') {
        throw new TypeError('Expected extra.from and extra.to to be strings.');
      }
      return overviewSort(
        (
          await axios.get(
            `/Xvision/OverviewScoresGraph/${customerId}/${from}/${to}/1`,
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
