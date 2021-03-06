// @flow

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import PageChart from './PageChart';
import { DataNotFound, DataIsLoading } from '../utils';

type Props = {
  title: string,
  data: $ReadOnlyArray<{
    +Period: string,
    +Average: number,
  }>,
  chartLineColor: string,
  loading?: boolean,
};

const LineChart = ({ title, data, chartLineColor, loading }: Props) => {
  const chart = (
    <PageChart>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="Period" tickLine={false} minTickGap={10} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={10}
          />
          <Tooltip isAnimationActive={false} cursor={false} />
          <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="1%" stopColor={chartLineColor} stopOpacity={0.4} />
              <stop offset="60%" stopColor={chartLineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="Average"
            stroke={chartLineColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#area-gradient)"
            activeDot={{ strokeWidth: 0, r: 5, fill: '#FE5045' }}
            dot
          />
        </AreaChart>
      </ResponsiveContainer>
    </PageChart>
  );

  return (
    <div className="page-content" style={{ padding: 0 }}>
      <h2 className="line-chart-title-container h3-size">{title}</h2>
      {loading ? <DataIsLoading /> : null}
      {(!data || data.length < 1) && !loading ? <DataNotFound /> : chart}
    </div>
  );
};

export default LineChart;
