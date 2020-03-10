// @flow
import React from 'react';
/*:: import * as R from 'react'; */

import { BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import PageChart from '../PageChart';
import type { Plot } from './types';

type Props<T: Plot> = {
  plots: $ReadOnlyArray<T>,
  children?: R.Node,
  offsetAngle?: number,
  angularSize?: number,
  valueFormatter?: (number, T, boolean) => ?string | number,
};

export default function Bars<T: Plot>({
  plots,
  children,
  offsetAngle,
  angularSize,
  valueFormatter,
}: Props<T>): R.Element<typeof PageChart> {
  const startAngle = 90 - (offsetAngle || 0);
  const endAngle = startAngle - (angularSize != null ? angularSize : 360);
  return (
    <PageChart>
      <ResponsiveContainer>
        <BarChart data={plots}>
          {children}
          <Tooltip
            labelFormatter={() => null}
            formatter={(value, name, { payload }) => [
              (valueFormatter && valueFormatter(value, payload, true)) || value,
              payload.name,
            ]}
            isAnimationActive={false}
          />
          {/*<Legend
            key="pie-chart-key"
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ bottom: -14 }}
            content={renderCustomLegend}
          />*/}
          <Bar
            data={plots}
            startAngle={startAngle}
            endAngle={endAngle}
            dataKey="value"
            nameKey="name"
            labelLine={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </PageChart>
  );
}
