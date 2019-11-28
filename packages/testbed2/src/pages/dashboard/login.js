// @flow
import React, { Component } from 'react';
import Router from 'next/router';
import {
  DashboardLayout,
  PageContent,
  ThemeSelector,
} from '@pija-ab/next-dashboard';

import Title from 'src/components/DashboardTitle';
import withDashboard, { Consumer } from 'src/utils/withDashboard';

type Props = {};

class Login extends Component<Props> {
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
      <DashboardLayout
        id="login"
        contentContainerWidth="extra-narrow"
        header={false}
        sidebar={false}
        footer={false}
      >
        <Title title="Login" />
        <Consumer>
          {({ auth }) => (
            <>
              <h1 className="page-title text-align-center">Login</h1>
              <PageContent>
                <a href="/" className="login-logo">
                  <img src="/images/logo.png" alt="XVision" />
                </a>
                <p className="margin-bottom-x4 text-align-center">
                  Please enter your email and password to continue.
                </p>
                <form className="margin-bottom-x2">
                  <div className="form-item">
                    <label htmlFor="username">Email Address</label>
                    <input type="text" id="username" />
                  </div>
                  <div className="form-item margin-bottom-x4">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" />
                  </div>
                  <div className="form-item">
                    <button
                      className="form-button"
                      type="button"
                      onClick={() => this.login(auth)}
                    >
                      Log In
                    </button>
                  </div>
                </form>
                <p className="text-align-center">
                  Don&apos;t have an account? <a href="#">Create Account!</a>
                </p>
              </PageContent>
              <ThemeSelector />
            </>
          )}
        </Consumer>
      </DashboardLayout>
    );
  }
}
export default withDashboard<Props>(Login, false);
