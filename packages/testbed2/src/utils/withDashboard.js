// @flow

import {
  createDashboardHOC,
  DashboardContext,
  type Config,
} from '@pija-ab/next-dashboard';
import ErrorComp from 'src/components/Error';

let authenticated = false;

const dataProvider = {
  update() {
    throw new Error('Not implemented');
  },
  data: {},
  needAuthDefault: true,
  isAuthorizedForRoute(): boolean {
    return authenticated;
  },
  getCurrentData() { return {}; },
  auth(data: { username: string, password: string }): boolean {
    console.log(data);
    authenticated = true;
    return authenticated;
  },
};

const config: Config = {
  unauthedRoute: '/dashboard/login',
  needAuthDefault: true,
  error: {
    Component: ErrorComp,
    withContext: true,
  },
};

const withDashboard = createDashboardHOC<typeof dataProvider>(
  dataProvider,
  config,
);
const { Provider, Consumer } = DashboardContext;
export default withDashboard;
export { DashboardContext as Context, Provider, Consumer };
