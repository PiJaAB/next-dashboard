// @flow

import createDashboardHOC from 'src/utils/createDashboardHOC';

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

const { withDashboard, Context } = createDashboardHOC<typeof dataProvider>(
  dataProvider,
);
const { Provider, Consumer } = Context;
export default withDashboard;
export { Context, Provider, Consumer };
