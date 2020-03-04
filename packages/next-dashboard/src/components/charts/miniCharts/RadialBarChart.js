// @flow
import React from 'react';
/*:: import * as R from 'react'; */

import {
  Legend,
  RadialBar,
  RadialBarChart as RechartRadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip,
  Customized,
} from 'recharts';
import WrapChart from './WrapChart';
import PageChart from '../PageChart';
import TextComp, { type StyledText } from './TextComp';
import type { Plot } from './types';

import { INNER_RADIUS, OUTER_RADIUS, PADDING, radius } from './utils';

type Props<T: Plot> = {
  plots: $ReadOnlyArray<T>,
  children?: R.Node,
  maxValue?: number,
  offsetAngle?: number,
  angularSize?: number,
  valueFormatter?: (number, T, boolean) => ?string | number,
  centerText?: StyledText | [StyledText, StyledText],
};

export default function RadialBarChart<T: Plot>({
  plots,
  children,
  maxValue,
  offsetAngle,
  angularSize,
  valueFormatter,
  centerText,
}: Props<T>): R.Element<typeof PageChart> {
  const startAngle = 90 - (offsetAngle || 0);
  const endAngle = startAngle - (angularSize != null ? angularSize : 360);
  const domain = [0, maxValue != null ? maxValue : 'auto'];
  return (
    <PageChart>
      <ResponsiveContainer>
        <WrapChart>
          {(width, height) => (
            <RechartRadialBarChart
              startAngle={startAngle}
              endAngle={endAngle}
              data={plots}
              cy={height / 2 - PADDING.BOTTOM + PADDING.TOP}
              cx={width / 2 - PADDING.RIGHT + PADDING.LEFT}
              innerRadius={radius(INNER_RADIUS, width, height)}
              outerRadius={radius(OUTER_RADIUS, width, height)}
              width={width}
              height={height}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              barCategoryGap="25%"
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
                key="radial-bar-chart-key"
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  bottom: -14,
                }}
                content={({ payload }) => (
                  <ul className="radial-bar-chart-types-list">
                    {payload.map(entry => (
                      <li key={entry.value} className="radial-bar-chart-type">
                        <div
                          className="radial-bar-chart-type-color"
                          style={{ backgroundColor: entry.color }}
                        />
                        {entry.value}
                      </li>
                    ))}
                  </ul>
                )}
              />
              <PolarAngleAxis type="number" tick={false} domain={domain} />
              <RadialBar
                dataKey="value"
                background={{ fill: 'rgba(0,0,0,0.2)' }}
                cornerRadius="50%"
                forceCornerRadius
                nameKey="name"
              />
              {centerText && (
                <Customized
                  component={() => (
                    <TextComp
                      text={centerText}
                      width={width}
                      height={height}
                      radius={radius(INNER_RADIUS, width, height)}
                    />
                  )}
                  key="RadialBarChartCustomizedElement"
                />
              )}
            </RechartRadialBarChart>
          )}
        </WrapChart>
      </ResponsiveContainer>
    </PageChart>
  );
}

RadialBarChart.defaultProps = {
  children: undefined,
  maxValue: undefined,
  offsetAngle: undefined,
  angularSize: undefined,
  valueFormatter: undefined,
  centerText: undefined,
};
