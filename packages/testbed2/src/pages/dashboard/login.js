// @flow
import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { PageContent, ThemeSelector } from '@pija-ab/next-dashboard';

import Layout from 'src/components/Layout';
import Title from 'src/components/DashboardTitle';
import withDashboard from 'src/utils/withDashboard';
import {
  type DashboardContextType,
  Consumer,
} from 'src/utils/dashboardContext';

type Props = {};

type State = {
  loading: boolean,
  username: string,
  password: string,
  error: ?string,
};

class Login extends Component<Props, State> {
  state: State = {
    loading: false,
    username: '',
    password: '',
    error: null,
  };

  static getInitialProps: void;

  login = async ({ dataProvider }: $NonMaybeType<DashboardContextType>) => {
    const { username, password } = this.state;
    console.log(Router.query);
    const { attemptedURI } = Router.query;
    this.setState({
      loading: true,
    });
    try {
      if (await dataProvider.auth(username, password)) {
        this.setState({
          password: '',
        });
        Router.push(attemptedURI || '/dashboard');
      } else {
        this.setState({
          error: 'Invalid credentials',
        });
      }
    } catch (err) {
      this.setState({
        error: err.message,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const { loading, username, password, error } = this.state;
    return (
      <Layout
        id="login"
        contentContainerWidth="extra-narrow"
        header={false}
        sidebar={false}
        footer={false}
      >
        <Title title="Login" />
        <Consumer>
          {ctx => {
            if (!ctx) {
              throw new TypeError('Header needs to be in a Dashboard Context');
            }
            const { theme } = ctx;
            const themeClass = theme.class;
            const logo = `logo${
              themeClass !== 'default' ? `-${themeClass}` : ''
            }.png`;
            return (
              <>
                <h1 className="page-title text-align-center">Login</h1>
                <PageContent>
                  <Link href="/dashboard">
                    <a className="dashboard-login-logo">
                      <img src={`/images/${logo}`} alt="XVision" />
                    </a>
                  </Link>
                  <p className="margin-bottom-x4 text-align-center">
                    Please enter your username and password to continue.
                  </p>
                  {error != null && (
                    <p className="margin-bottom-x4 color-error text-align-center">
                      {error}
                    </p>
                  )}
                  <form className="margin-bottom-x2">
                    <div className="form-item">
                      <label htmlFor="username">Username</label>
                      <input
                        onChange={ev =>
                          this.setState({ username: ev.target.value })
                        }
                        disabled={loading}
                        value={username}
                        type="text"
                        id="username"
                      />
                    </div>
                    <div className="form-item margin-bottom-x4">
                      <label htmlFor="password">Password</label>
                      <input
                        onChange={ev =>
                          this.setState({ password: ev.target.value })
                        }
                        value={password}
                        disabled={loading}
                        type="password"
                        id="password"
                      />
                    </div>
                    <div className="form-item">
                      {!loading ? (
                        <button
                          className="form-button"
                          type="button"
                          onClick={() => this.login(ctx)}
                        >
                          Log In
                        </button>
                      ) : (
                        <button className="form-button" type="button" disabled>
                          Logging In...
                        </button>
                      )}
                    </div>
                  </form>
                  <p className="text-align-center">
                    Don&apos;t have an account? <a href="#">Create Account!</a>
                  </p>
                </PageContent>
                <ThemeSelector />
              </>
            );
          }}
        </Consumer>
      </Layout>
    );
  }
}
export default withDashboard<Props>(Login, false);
