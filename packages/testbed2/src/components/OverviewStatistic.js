// @flow

import React from 'react';
import { useData, Statistic } from '@pija-ab/next-dashboard';
import type { Data, Scores } from 'src/utils/dataProvider';

type StatProps = $PropertyType<Statistic, 'props'>;

type OverviewProps = {|
  category: $Keys<Scores>,
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

export default function OverviewStatistic({
  category,
  label: providedLabel,
  ...props
}: Props): React$Node {
  const data = useData<Data>('overview').overview;
  const label = providedLabel || category;
  if (data.status === 'loading') {
    return <Statistic value="Loading" label={label} {...props} />;
  }
  if (data.status === 'error') {
    return <Statistic value="Error!" label={label} {...props} />;
  }
  const len = data.value.periodScores.length;
  if (len < 1)
    return <Statistic value="Insufficient data" label={label} {...props} />;
  const current = data.value.periodScores[data.value.periodScores.length - 1];
  if (len < 2)
    return <Statistic value={current[category]} label={label} {...props} />;
  const prev = data.value.periodScores[data.value.periodScores.length - 2];
  const percentage = toPercent(current[category], prev[category]);
  return (
    <Statistic
      value={current[category]}
      description={`${percentage}% from last period`}
      label={label}
      {...props}
    />
  );
}
