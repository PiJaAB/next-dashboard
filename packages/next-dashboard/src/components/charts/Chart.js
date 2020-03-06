// @flow

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
} from 'recharts';
import PageChart from './PageChart';
import { DataNotFound, DataIsLoading } from '../utils';

type Props = {
  title: string,
  data: $ReadOnlyArray<{
    +[string]: mixed,
  }>,
  chartLineColor: string,
  loading?: boolean,
  xAxisKey: ?string,
  areaChartKey: ?string,
  barChartKeysAndColor?:
    | null
    | { key: string, color: string }
    | { key: string, color: string, stackId?: string }[],
};

const renderBars = barChartKeysAndColor => {
  if (barChartKeysAndColor) {
    if (Array.isArray(barChartKeysAndColor)) {
      return barChartKeysAndColor.map(({ key, color, stackId }) => (
        <Bar dataKey={key} barSize={20} stackId={stackId} fill={color} />
      ));
    }
    return (
      <Bar
        dataKey={barChartKeysAndColor.key}
        barSize={20}
        fill={barChartKeysAndColor.color}
      />
    );
  }
  return null;
};

const Chart = ({
  title,
  data,
  chartLineColor,
  loading = false,
  xAxisKey,
  areaChartKey,
  barChartKeysAndColor,
}: Props) => {
  const chart = (
    <PageChart>
      <ResponsiveContainer className="line-chart">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 30, left: 24, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            minTickGap={10}
            height={50}
            dy={20}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            minTickGap={10}
            dx={-45}
          />
          <Tooltip isAnimationActive={false} cursor={false} />
          {renderBars(barChartKeysAndColor)}
          <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="1%" stopColor={chartLineColor} stopOpacity={0.4} />
              <stop offset="60%" stopColor={chartLineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          {areaChartKey ? (
            <Area
              type="monotone"
              dataKey={areaChartKey}
              stroke={chartLineColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#area-gradient)"
              activeDot={{ strokeWidth: 0, r: 5, fill: '#FE5045' }}
              dot
            />
          ) : null}
          <Legend
            content={({ payload }) => (
              <ul className="line-chart-legend-list">
                {payload.map(entry => (
                  <li key={entry.value} className="line-chart-type">
                    <div
                      className="line-chart-type-color"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.value}
                  </li>
                ))}
              </ul>
            )}
          />
        </ComposedChart>
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

export default Chart;
