// @flow
import React, { Component } from 'react';
import { DashboardLayout, PageContent } from '@pija-ab/next-dashboard';

import Nav from 'src/components/Nav';
import { Title } from 'src/components/SEO';

import withDashboard from 'src/utils/withDashboard';
import type { InitialPropsContext } from 'src/utils/nextTypes';

// TODO: Page title?
// TODO: import/no-cycle.

type InitialProps = {
  statusCode: number,
};

type Props = InitialProps & {};

class Page extends Component<Props> {
  static async getInitialProps(
    ctx: InitialPropsContext,
  ): Promise<InitialProps> {
    const { res, err } = ctx;
    const errStatus = err && err.statusCode;
    const resStatus = res && res.statusCode;
    const statusCode = resStatus || errStatus || 404;
    return { statusCode };
  }

  static title = 'Fel';

  render() {
    const { statusCode } = this.props;
    return (
      <DashboardLayout>
        <Title
          pageName={[String(statusCode) || Page.title, String(statusCode)]}
        />
        <Nav />
        <h1 className="page-title">
          {statusCode === 404 ? 'Page Not Found' : 'Error'}
        </h1>
        <PageContent>
          <p className="text-align-center">
            {statusCode === 404
              ? 'The page you are trying to visit is does not exist.'
              : 'Something is not right.'}
          </p>
          <p className="text-align-center">
            Go to <a href="#">Overview</a>.
          </p>
        </PageContent>
      </DashboardLayout>
    );
  }
}

export default withDashboard<Props>(Page, false);
