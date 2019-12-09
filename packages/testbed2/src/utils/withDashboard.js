// @flow

import { createDashboardHOC, type Config } from '@pija-ab/next-dashboard';
import ErrorComp from 'src/components/Error';
import provider from 'src/utils/dataProvider';

const config: Config = {
  unauthedRoute: '/dashboard/login',
  needAuthDefault: true,
  error: {
    Component: ErrorComp,
    withContext: true,
  },
};

const withDashboard = createDashboardHOC(provider, config);
export default withDashboard;
