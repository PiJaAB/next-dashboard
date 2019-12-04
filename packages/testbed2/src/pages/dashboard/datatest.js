// @flow
import React from 'react';
import { Statistic } from '@pija-ab/next-dashboard';
import Layout from 'src/components/Layout';
import withDashboard from 'src/utils/withDashboard';

const Start = () => (
  <Layout>
    <div>
      <h1 className="page-title">Data from API</h1>
      <div className="grid">
        <div className="cell column-6-medium column-3-large">
          <Statistic.WithData
            label="Resources"
            dataSource="overview"
            path={['periodScores', 0, 'Resources']}
            description="23% from last period"
          />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic.WithData
            label="Quality"
            dataSource="overview"
            path={['periodScores', 0, 'Quality']}
            description="46% from last period"
          />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic.WithData
            label="Volume"
            dataSource="overview"
            path={['periodScores', 0, 'Volume']}
            description="15% from last period"
          />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic.WithData
            label="Leadership"
            dataSource="overview"
            path={['periodScores', 0, 'Leadership']}
            description="55% from last period"
          />
        </div>
      </div>
    </div>
  </Layout>
);

export default withDashboard<{}>(Start, true);
