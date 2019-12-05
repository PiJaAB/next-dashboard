// @flow

import { createDashboardHOC, type Config } from '@pija-ab/next-dashboard';
import ErrorComp from 'src/components/Error';
import XzaxtProvider, { type Data } from 'src/utils/dataProvider';

const config: Config = {
  unauthedRoute: '/dashboard/login',
  needAuthDefault: true,
  error: {
    Component: ErrorComp,
    withContext: true,
  },
};

const withDashboard = createDashboardHOC<Data>(new XzaxtProvider(), config);
export default withDashboard;
