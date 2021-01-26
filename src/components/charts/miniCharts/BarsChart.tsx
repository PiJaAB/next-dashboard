import React from 'react';

import { BarChart, Bar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PADDING, renderCustomLegend } from '../utils';
import PageChart from '../PageChart';
import type { Plot } from './types';
import WrapChart from '../WrapChart';

type Props<T extends Plot> = React.PropsWithChildren<{
  plots: ReadonlyArray<T>,
  valueFormatter?: (
    num: string | number | ReadonlyArray<(string | number)>,
    plot: T,
    isTooltip: boolean,
  ) => string | number | null | undefined;
  maxBarSize?: number,
  maxGapSize?: number,
  gapSize?: number,
  barSize?: number,
  legend?: boolean,
  valign?: 'left' | 'center' | 'right',
  pageChart?: boolean,
}>;

export default function BarsChart<T extends Plot>({
  plots,
  children,
  valueFormatter,
  gapSize,
  barSize,
  maxBarSize,
  maxGapSize,
  legend = true,
  valign = 'center',
  pageChart = true,
}: Props<T>): JSX.Element {
  const data: Partial<Record<string, number>>[] = [];
  plots.forEach(e => {
    data.push({ [e.key != null ? e.key : e.name]: e.value });
  });
  const Wrapper = pageChart ? PageChart : React.Fragment;
  return (
    <Wrapper>
      <ResponsiveContainer>
        <WrapChart hoffset={legend ? PADDING.BOTTOM : 0}>
          {(width, height) => {
            let margin = 0;
            let catGap = gapSize;
            if (typeof gapSize === 'number' && typeof maxGapSize === 'number') {
              catGap = Math.min(gapSize, maxGapSize);
            }
            if (maxGapSize != null && maxBarSize != null) {
              const gaps = Math.max(plots.length - 1, 0);
              const chartMaxWidth =
                gaps * maxGapSize + plots.length * maxBarSize;
              margin = Math.max(0, (width - chartMaxWidth) / 2);
            }
            let leftMargin = margin;
            let rightMargin = margin;
            if (valign === 'left') {
              rightMargin *= 2;
              leftMargin = 0;
            }
            if (valign === 'right') {
              leftMargin *= 2;
              rightMargin = 0;
            }
            return (
              <BarChart
                width={width}
                margin={{ left: leftMargin, right: rightMargin }}
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
                  allowEscapeViewBox={{ x: false, y: true }}
                />
                {legend && (
                  <Legend
                    verticalAlign="bottom"
                    content={renderCustomLegend}
                    width={width}
                    wrapperStyle={{ left: 0, bottom: -14 }}
                  />
                )}
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
    </Wrapper>
  );
}
