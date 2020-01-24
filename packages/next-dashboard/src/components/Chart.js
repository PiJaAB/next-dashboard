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

type Props = {
  title: string,
  data: $ReadOnlyArray<{
    +Period: string,
    +Average: number,
  }>,
  chartLineColor: string,
  loading?: boolean,
  areaChartKey?: string,
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
  loading,
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
            dataKey="Period"
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

  const dataNotFound = (
    <h3
      className="line-chart-title-container h3-size"
      style={{ paddingTop: 0, paddingBottom: 38 }}
    >
      No Data found
    </h3>
  );

  const isLoading = (
    <h3
      className="line-chart-title-container h3-size"
      style={{ paddingTop: 0, paddingBottom: 38 }}
    >
      Loading
    </h3>
  );

  return (
    <div className="page-content" style={{ padding: 0 }}>
      <h2 className="line-chart-title-container h3-size">{title}</h2>
      {loading ? isLoading : null}
      {(!data || data.length < 1) && !loading ? dataNotFound : chart}
    </div>
  );
};

Chart.defaultProps = {
  loading: false,
  areaChartKey: null,
  barChartKeysAndColor: null,
};

export default Chart;
