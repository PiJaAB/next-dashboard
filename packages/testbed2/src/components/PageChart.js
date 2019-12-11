// @flow
import React, { useState } from 'react';

import { PageChart as ChartWrapper } from '@pija-ab/next-dashboard';

import type { ScoresObj } from 'src/API/types';
import toDigits from 'src/utils/toDigits';

import {
  ResponsiveContainer,
  Legend,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
} from 'recharts';

type LegendPayload = {
  dataKey: string,
  inactive: boolean,
  value: string,
  color: string,
  type: string,
  id?: string,
};

type Props<T: {} = {}> = {
  data: T[],
  plots: {
    name?: string,
    dataKey: string,
    type: 'line' | 'area' | 'bar',
    legendType?:
      | 'line'
      | 'square'
      | 'rect'
      | 'circle'
      | 'cross'
      | 'diamond'
      | 'square'
      | 'star'
      | 'triangle'
      | 'wye'
      | 'none',
    color?: string,
  }[],
  children?: React$Node,
};

function onLegendClick(
  entry: LegendPayload,
  setInactive: (
    | (({ [string]: ?boolean }) => { [string]: ?boolean })
    | { [string]: ?boolean },
  ) => void,
) {
  setInactive(inactive => ({
    ...inactive,
    [entry.dataKey]: !inactive[entry.dataKey],
  }));
}

export default function PageChart<T: {}>({
  data,
  plots,
  children,
}: Props<T>): React$Element<'div'> {
  const [inactive, setInactive] = useState<{ [string]: ?boolean }>({});
  return (
    <div className="cell">
      <ChartWrapper>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            {children}
            <CartesianGrid />
            <XAxis
              name="test"
              dataKey={({ Period }: ScoresObj) =>
                toDigits(Period.split(':')[1], 2)
              }
            />
            <YAxis />
            <Tooltip isAnimationActive={false} />
            <Legend
              verticalAlign="top"
              height={36}
              iconSize={20}
              onClick={entry => onLegendClick(entry, setInactive)}
            />
            {plots.map(p => {
              const curActive = !inactive[p.dataKey];
              switch (p.type) {
                case 'line':
                  return (
                    <Line
                      key={`chart-${p.type}-${p.dataKey}`}
                      stroke={p.color}
                      hide={!curActive}
                      type="monotone"
                      name={p.name}
                      dataKey={p.dataKey}
                      animationDuration={250}
                    />
                  );
                case 'area':
                  return (
                    <Area
                      key={`chart-${p.type}-${p.dataKey}`}
                      stroke={p.color}
                      hide={!curActive}
                      type="monotone"
                      name={p.name}
                      dataKey={p.dataKey}
                      animationDuration={250}
                    />
                  );
                case 'bar':
                  return (
                    <Bar
                      key={`chart-${p.type}-${p.dataKey}`}
                      fill={p.color}
                      hide={!curActive}
                      name={p.name}
                      dataKey={p.dataKey}
                      animationDuration={250}
                    />
                  );
                default:
                  return <span key={`chart-${p.type}-${p.dataKey}`} />;
              }
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}

PageChart.defaultProps = {
  children: undefined,
};
