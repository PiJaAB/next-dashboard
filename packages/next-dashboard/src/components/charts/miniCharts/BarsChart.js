// @flow
import React from 'react';
/*:: import * as R from 'react'; */

import { BarChart, Bar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { renderCustomLegend } from './utils';
import PageChart from '../PageChart';
import type { Plot } from './types';
import WrapChart from './WrapChart';

type Props<T: Plot> = {
  plots: $ReadOnlyArray<T>,
  children?: R.Node,
  valueFormatter?: (number, T, boolean) => ?string | number,
  maxBarSize?: number,
  maxGapSize?: number,
  gapSize?: number,
  barSize?: number,
};

export default function BarsChart<T: Plot>({
  plots,
  children,
  valueFormatter,
  gapSize,
  barSize,
  maxBarSize,
  maxGapSize,
}: Props<T>): R.Element<typeof PageChart> {
  const data: { [string]: ?number }[] = [];
  plots.forEach(e => {
    data.push({ [e.key != null ? e.key : e.name]: e.value });
  });
  return (
    <PageChart>
      <ResponsiveContainer>
        <WrapChart>
          {(width, height) => {
            let margin = 0;
            let catGap = gapSize != null ? gapSize : maxGapSize;
            if (typeof gapSize === 'number' && typeof maxGapSize === 'number') {
              catGap = Math.min(gapSize, maxGapSize);
            }
            if (maxGapSize != null && maxBarSize != null) {
              const gaps = Math.max(plots.length - 1, 0);
              const chartMaxWidth =
                gaps * maxGapSize + plots.length * maxBarSize;
              margin = Math.max(0, (width - chartMaxWidth) / 2);
            }
            return (
              <BarChart
                width={width}
                margin={{ left: margin, right: margin }}
                height={height}
                data={data}
                barSize={barSize}
                barCategoryGap={catGap}
                maxBarSize={maxBarSize}
              >
                {children}
                <Tooltip
                  labelFormatter={() => null}
                  formatter={(value, name, { payload }) => [
                    (valueFormatter && valueFormatter(value, payload, true)) ||
                      value,
                    name,
                  ]}
                  cursor={false}
                  isAnimationActive={false}
                />
                <Legend
                  verticalAlign="bottom"
                  content={renderCustomLegend}
                  width={width}
                  wrapperStyle={{ left: 0, bottom: -14 }}
                />
                {plots.map(e => (
                  <Bar
                    key={e.key != null ? e.key : e.name}
                    dataKey={e.key != null ? e.key : e.name}
                    name={e.name}
                    fill={e.fill}
                    stackId="yes"
                  />
                ))}
              </BarChart>
            );
          }}
        </WrapChart>
      </ResponsiveContainer>
    </PageChart>
  );
}
