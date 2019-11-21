// @flow

import {
  createDashboardHOC,
  DashboardContext,
  type Config,
} from '@pija-ab/react-dashboard';
import ErrorComp from 'src/pages/_error';

let authenticated = false;

const dataProvider = {
  update() {
    throw new Error('Not implemented');
  },
  data: {},
  needAuthDefault: true,
  isAuthenticated(): boolean {
    return authenticated;
  },
  auth(data: { username: string, password: string }): boolean {
    console.log(data);
    authenticated = true;
    return authenticated;
  },
};

const config: Config = {
  unauthedRoute: '/dashboard/login',
  needAuthDefault: true,
  errorComponent: ErrorComp,
};

const withDashboard = createDashboardHOC<typeof dataProvider>(
  dataProvider,
  config,
);
const { Provider, Consumer } = DashboardContext;
export default withDashboard;
export { DashboardContext as Context, Provider, Consumer };
