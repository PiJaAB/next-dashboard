// @flow

import React from 'react';
import { useData, Statistic } from '@pija-ab/next-dashboard';
import type { Scores } from 'src/API/types';
import subscriberProvider from 'src/API/subscriberProvider';
import toDigits from 'src/utils/toDigits';

type StatProps = $PropertyType<Statistic, 'props'>;

type OverviewProps = {|
  category: $Keys<Scores>,
  date: Date,
  label?: string,
|};

type ProvidedProps = {
  value: $PropertyType<StatProps, 'value'>,
  description: $PropertyType<StatProps, 'description'>,
};

type Props = {
  ...$Diff<StatProps, ProvidedProps>,
  ...OverviewProps,
};

function toPercent(a: number, b: number, targetNum: number = 2): string {
  const percent = (a / b) * 100;
  const fixed = Math.min(
    Math.max(0, targetNum - 1 - Math.trunc(Math.log10(percent))),
    targetNum - 1,
  );
  return percent.toFixed(fixed);
}

function dateToParams(inputDate: Date): { from: string, to: string } {
  const date = new Date(inputDate);

  const to = `${date.getFullYear()}-${toDigits(date.getMonth() + 1, 2)}`;

  date.setMonth(date.getMonth() - 1, 1);

  const from = `${date.getFullYear()}-${toDigits(date.getMonth() + 1, 2)}`;

  return { from, to };
}

export default function OverviewStatistic({
  category,
  date,
  label: providedLabel,
  ...props
}: Props): React$Node {
  const params = dateToParams(date);
  const data = useData(subscriberProvider, 'overview', params);
  const label = providedLabel || category;
  if (data.status === 'loading') {
    return <Statistic value="Loading" label={label} {...props} />;
  }
  if (data.status === 'error') {
    return <Statistic value="Error!" label={label} {...props} />;
  }
  const periods = [params.from, params.to].map(p =>
    data.value.PeriodScores.find(
      e =>
        e.Period ===
        p
          .split('-')
          .map(q => String(Number(q)))
          .join(':'),
    ),
  );
  if (!periods[1] || !periods[1][category])
    return <Statistic value="No data" label={label} {...props} />;
  const cur = periods[1][category];
  if (!periods[0] || !periods[0][category])
    return <Statistic value={cur} label={label} {...props} />;
  const prev = periods[0][category];
  const percentage = toPercent(prev, cur);
  return (
    <Statistic
      value={cur}
      description={percentage && `${percentage}% from previous month`}
      label={label}
      {...props}
    />
  );
}
