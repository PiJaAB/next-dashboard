// @flow

import { SubscriptionPoller } from '@pija-ab/next-dashboard';
import fetchers from './fetchers';
import type { Data } from './types';
import errorAuthReporter from './authProvider';

const subscriptionProvider = new SubscriptionPoller<Data>(fetchers);

subscriptionProvider.on('error', (...args) =>
  errorAuthReporter.emit('error', ...args),
);

export default subscriptionProvider;
