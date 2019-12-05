// @flow
import React from 'react';
import Statistic from 'src/components/OverviewStatistic';
import Layout from 'src/components/Layout';
import withDashboard from 'src/utils/withDashboard';

const Start = () => (
  <Layout>
    <div>
      <h1 className="page-title">Data from API</h1>
      <div className="grid">
        <div className="cell column-6-medium column-3-large">
          <Statistic category="Resources" />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic category="Quality" />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic category="Volume" />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic category="Leadership" />
        </div>
      </div>
    </div>
  </Layout>
);

export default withDashboard<{}>(Start, true);
