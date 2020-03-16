// @flow
import React from 'react';
/*:: import * as R from 'react'; */

import {
  Legend,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import WrapChart from '../WrapChart';
import PageChart from '../PageChart';
import RenderCustomizedPieLabel from './RenderCustomizedPieLabel';
import type { Plot } from './types';

import {
  OUTER_RADIUS,
  pieRadius,
  getCenter,
  renderCustomLegend,
  PADDING,
} from '../utils';

type Props<T: Plot> = {
  plots: $ReadOnlyArray<T>,
  children?: R.Node,
  offsetAngle?: number,
  angularSize?: number,
  valueFormatter?: (number, T, boolean) => ?string | number,
};

export default function PieChart<T: Plot>({
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
        <WrapChart hoffset={PADDING.BOTTOM}>
          {(width, height) => (
            <RechartPieChart
              height={height}
              width={width}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              {children}
              <Tooltip
                labelFormatter={() => null}
                formatter={(value, name, { payload }) => [
                  (valueFormatter && valueFormatter(value, payload, true)) ||
                    value,
                  payload.name,
                ]}
                isAnimationActive={false}
              />
              <Legend
                key="pie-chart-key"
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ bottom: -14 }}
                content={renderCustomLegend}
              />
              <Pie
                {...getCenter(width, height)}
                data={plots}
                outerRadius={pieRadius(OUTER_RADIUS, width, height)}
                startAngle={startAngle}
                endAngle={endAngle}
                dataKey="value"
                nameKey="name"
                labelLine={false}
                label={props =>
                  RenderCustomizedPieLabel({
                    ...props,
                    valueFormatter,
                    width,
                    height,
                  })
                }
              />
            </RechartPieChart>
          )}
        </WrapChart>
      </ResponsiveContainer>
    </PageChart>
  );
}
