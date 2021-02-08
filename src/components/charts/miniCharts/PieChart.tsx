import React from 'react';

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

type Props<T extends Plot> = React.PropsWithChildren<{
  plots: ReadonlyArray<T>;
  offsetAngle?: number;
  angularSize?: number;
  valueFormatter?: (
    num: string | number | ReadonlyArray<string | number>,
    plot: T,
    isTooltip: boolean,
  ) => string | number | null | undefined;
}>;

export default function PieChart<T extends Plot>({
  plots,
  children,
  offsetAngle,
  angularSize,
  valueFormatter,
}: Props<T>): JSX.Element {
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
                label={(props) =>
                  RenderCustomizedPieLabel<T>({
                    ...props,
                    valueFormatter,
                    width,
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
