// @flow
import React from 'react';
import {
  Legend,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import WrapChart from './WrapChart';
import PageChart from '../PageChart';
import RenderCustomizedPieLabel from './RenderCustomizedPieLabel';
import type { Plot } from './types';

import { PADDING, OUTER_RADIUS, pieRadius } from './utils';

import { RENDER_ISSUE_OFFSET_PADDING } from './rechartsCorrections';

type Props<T: Plot> = {
  plots: $ReadOnlyArray<T>,
  children?: React$Node,
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
}: Props<T>): React$Element<typeof PageChart> {
  const startAngle = 90 - (offsetAngle || 0);
  const endAngle = startAngle - (angularSize != null ? angularSize : 360);
  return (
    <PageChart>
      <ResponsiveContainer>
        <WrapChart>
          {(width, height) => (
            <RechartPieChart
              height={height}
              width={width}
              dashboardPlots={plots}
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
                content={({ payload }) => (
                  <ul className="pie-chart-types-list">
                    {payload.map(entry => (
                      <li key={entry.value} className="pie-chart-type">
                        <div
                          className="pie-chart-type-color"
                          style={{ backgroundColor: entry.color }}
                        />
                        {entry.value}
                      </li>
                    ))}
                  </ul>
                )}
              />
              <Pie
                cy={
                  height / 2 -
                  PADDING.BOTTOM +
                  PADDING.TOP -
                  RENDER_ISSUE_OFFSET_PADDING
                }
                cx={width / 2 - PADDING.RIGHT + PADDING.LEFT}
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

PieChart.defaultProps = {
  children: undefined,
  offsetAngle: undefined,
  angularSize: undefined,
  valueFormatter: undefined,
};
