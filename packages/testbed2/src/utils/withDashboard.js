// @flow

import { createDashboardHOC, type Config } from '@pija-ab/next-dashboard';
import ErrorComp from 'src/components/Error';
import errorAuthReporter from 'src/API/authProvider';

const config: Config = {
  errorAuthReporter,
  unauthedRoute: '/dashboard/login',
  needAuthDefault: true,
  error: {
    Component: ErrorComp,
    withContext: true,
  },
};

const withDashboard = createDashboardHOC(config);
export default withDashboard;
