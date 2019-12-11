// @flow
import React, { useState } from 'react';
import Statistic from 'src/components/OverviewStatistic';
import OverviewChart from 'src/components/OverviewChart';
import Layout from 'src/components/Layout';
import MonthSelector from 'src/components/MonthSelector';
import withDashboard from 'src/utils/withDashboard';

function Start(): React$Node {
  const initialDate = new Date();
  initialDate.setDate(0);

  const [date, setDate] = useState(initialDate);

  return (
    <Layout>
      <div>
        <MonthSelector
          date={date}
          setDate={setDate}
          initialDate={initialDate}
        />
        <h1 className="page-title">Monthly Overview</h1>
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
          <OverviewChart date={date} />
        </div>
      </div>
    </Layout>
  );
}

export default withDashboard<{}>(Start, true);
