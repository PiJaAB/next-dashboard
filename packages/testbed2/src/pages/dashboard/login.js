// @flow
import React, { PureComponent } from 'react';
import Router from 'next/router';
import { DashboardLayout } from '@pija-ab/next-dashboard';

import Title from 'src/components/DashboardTitle';
import withDashboard, { Consumer } from 'src/utils/withDashboard';
import Nav from 'src/components/LoginNav';

type Props = {};

class Login extends PureComponent<Props> {
  static getInitialProps: void;

  login = (auth: (data: { username: string, password: string }) => boolean) => {
    if (auth({ username: 'beep', password: 'boop' })) {
      Router.push('/dashboard');
    } else {
      window.alert('Waaaaah');
    }
  };

  render() {
    return (
      <DashboardLayout>
        <Nav />
        <Title title="Login" />
        <Consumer>
          {({ auth }) => (
            <>
              <label htmlFor="username">Username:</label>
              <input id="username" />
              <label htmlFor="password">Password:</label>
              <input id="password" />
              <button type="button" onClick={() => this.login(auth)}>
                login
              </button>
            </>
          )}
        </Consumer>
      </DashboardLayout>
    );
  }
}
export default withDashboard<Props>(Login, false);
