// @flow
import React from 'react';

import { useData, PageChart } from '@pija-ab/next-dashboard';

import subscriberProvider from 'src/API/subscriberProvider';
import useThemeVars from 'src/utils/useThemeVars';
import toDigits from 'src/utils/toDigits';
import { XAxis } from 'recharts';
import Chart from './Chart';

type Props = {
  date: Date,
};

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

export default function OverviewChart({ date }: Props): React$Node {
  const data = useData(subscriberProvider, 'overviewChart', dateToParams(date));
  const year = toDigits(date.getFullYear(), 4);
  const { overviewChart } = useThemeVars();
  if (data.status === 'loading') {
    return (
      <PageChart>
        <h1>Loading...</h1>
      </PageChart>
    );
  }
  if (data.status === 'error') {
    return (
      <PageChart>
        <h1>Error fetching data!</h1>
      </PageChart>
    );
  }
  const chart = data.value.PeriodScores.map(p => {
    const { Period, ...scores } = p;
    return {
      Period: `${year}-${Period.split(':')
        .map(s => toDigits(s, 2))
        .join('-')}`,
      ...scores,
    };
  });
  const plots = [
    {
      dataKey: 'Average',
      type: 'line',
      color: overviewChart.Average,
    },
    {
      dataKey: 'Volume',
      type: 'line',
      color: overviewChart.Volume,
    },
    {
      dataKey: 'Quality',
      type: 'line',
      color: overviewChart.Quality,
    },
    {
      dataKey: 'Resources',
      type: 'line',
      color: overviewChart.Resources,
    },
    {
      dataKey: 'Leadership',
      type: 'line',
      color: overviewChart.Leadership,
    },
  ];
  return (
    <Chart data={chart} plots={plots}>
      <XAxis
        dataKey="Period"
        tickFormatter={val => val.replace(/.*-(\d{1,2})$/, (_, m) => m)}
      />
    </Chart>
  );
}
OverviewChart.defaultProps = {
  Volume: true,
  Quality: true,
  Resources: true,
  Leadership: true,
  Average: true,
};
