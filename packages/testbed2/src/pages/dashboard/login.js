// @flow
import React, { useCallback, useContext, useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import {
  PageContent,
  ThemeSelector,
  DashboardContext,
} from '@pija-ab/next-dashboard';

import Layout from 'src/components/Layout';
import Title from 'src/components/DashboardTitle';
import withDashboard from 'src/utils/withDashboard';
import provider from 'src/utils/dataProvider';

type Props = {};

function Login(): React$Node {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const login = useCallback(async () => {
    const { attemptedURI } = Router.query;
    setLoading(true);
    try {
      if (await provider.auth(username, password)) {
        setPassword('');
        Router.push(attemptedURI || '/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username, password]);

  const handleSubmit = useCallback(
    ev => {
      ev.preventDefault();
      login();
      return false;
    },
    [login],
  );

  const ctx = useContext(DashboardContext);

  if (!ctx) {
    throw new TypeError('Login needs to be in a Dashboard Context');
  }

  const themeClass = ctx.theme.class;
  const logo = `logo${themeClass !== 'default' ? `-${themeClass}` : ''}.png`;

  return (
    <Layout
      id="login"
      contentContainerWidth="extra-narrow"
      header={false}
      sidebar={false}
      footer={false}
    >
      <Title title="Login" />
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
        <form className="margin-bottom-x2" onSubmit={handleSubmit}>
          <div className="form-item">
            <label htmlFor="username">Username</label>
            <input
              onChange={ev => setUsername(ev.target.value)}
              disabled={loading}
              value={username}
              type="text"
              id="username"
            />
          </div>
          <div className="form-item margin-bottom-x4">
            <label htmlFor="password">Password</label>
            <input
              onChange={ev => setPassword(ev.target.value)}
              value={password}
              disabled={loading}
              type="password"
              id="password"
            />
          </div>
          <div className="form-item">
            {!loading ? (
              <button className="form-button" type="submit">
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
    </Layout>
  );
}

export default withDashboard<Props>(Login, false);
