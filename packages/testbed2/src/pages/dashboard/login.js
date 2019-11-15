// @flow
import React, { PureComponent } from 'react';
import Router from 'next/router';

import withDashboard, { Consumer } from 'src/utils/withDashboard';

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
      <div>
        Plz login tyvm
        <Consumer>
          {({ auth }) => (
            <button type="button" onClick={() => this.login(auth)}>
              login
            </button>
          )}
        </Consumer>
      </div>
    );
  }
}
export default withDashboard<Props>(Login, false);
