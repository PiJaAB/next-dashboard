// @flow
import React, { useState } from 'react';
import Statistic from 'src/components/OverviewStatistic';
import OverviewChart from 'src/components/OverviewChart';
import Layout from 'src/components/Layout';
import withDashboard from 'src/utils/withDashboard';
import toDigits from 'src/utils/toDigits';

function dateToParams(inputDate: Date): { from: string, to: string } {
  const date = new Date(inputDate);

  // Ensure date is at the first of the month.
  date.setDate(1);

  const from = `${date.getFullYear()}-${toDigits(
    date.getMonth() + 1,
    2,
  )}-${toDigits(date.getDate(), 2)}`;

  // Set the date to the day before the first day of the next month,
  // aka, last day of current month.
  date.setMonth(date.getMonth() + 1, 0);

  const to = `${date.getFullYear()}-${toDigits(
    date.getMonth() + 1,
    2,
  )}-${toDigits(date.getDate(), 2)}`;

  return { from, to };
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function Start(): React$Node {
  const initialDate = new Date();
  initialDate.setDate(0);

  const [date, setDate] = useState(initialDate);

  return (
    <Layout>
      <div>
        <h1 className="page-title">
          Monthly Overview
        </h1>
        <h3 className="page-subtitle">
          {date.getFullYear()} {monthNames[date.getMonth()]}
        </h3>
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
          <OverviewChart {...dateToParams(date)} />
        </div>
      </div>
    </Layout>
  );
}

export default withDashboard<{}>(Start, true);
