// @flow

import {
  makeSilent,
  type PollingFetcher,
  type DataExtra,
} from '@pija-ab/next-dashboard';
import authProvider from './authProvider';
import type { Overview, CustInfo } from './types';
import axios from './axios';
import sortBy from '../utils/sortBy';

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
          await axios
            .get(`/Xvision/OverviewScoresGraph/${customerId}/${from}/${to}/2`)
            .catch(makeSilent)
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
          await axios
            .get(`/Xvision/OverviewScoresGraph/${customerId}/${from}/${to}/1`)
            .catch(makeSilent)
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
