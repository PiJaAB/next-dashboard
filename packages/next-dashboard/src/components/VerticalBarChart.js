// @flow

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
} from 'recharts';

type Props = {
  title: string,
  data: $ReadOnlyArray<{
    +Fullname: string,
    +loggedtime: number,
    +utilization: number,
  }>,
  loading?: boolean,
  barChartKeysAndColor?:
    | null
    | { key: string, color: string }
    | { key: string, color: string, stackId?: string }[],
};

const renderBars = barChartKeysAndColor => {
  if (barChartKeysAndColor) {
    if (Array.isArray(barChartKeysAndColor)) {
      return barChartKeysAndColor.map(({ key, color, stackId }, index) => (
        <Bar
          dataKey={key}
          barSize={12}
          stackId={stackId}
          fill={color}
          yAxisId={index}
        />
      ));
    }
    return (
      <Bar
        dataKey={barChartKeysAndColor.key}
        barSize={12}
        fill={barChartKeysAndColor.color}
      />
    );
  }
  return null;
};

const Chart = ({ title, data, loading, barChartKeysAndColor }: Props) => {
  const chart = (
    <div className="page-chart vertical-bar-chart-container">
      <div className="page-chart-content">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 30, bottom: 0 }}
            layout="vertical"
            className="vertical-bar-chart"
          >
            <CartesianGrid vertical={false} />
            <XAxis tick={false} type="number" axisLine={false} />
            <YAxis
              dataKey="Fullname"
              tickLine={false}
              axisLine={false}
              type="category"
              width={200}
              yAxisId={0}
              dx={-18}
            />
            <YAxis
              dataKey="Fullname"
              tickLine={false}
              axisLine={false}
              type="category"
              width={200}
              hide
              yAxisId={1}
            />
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
            <Tooltip isAnimationActive={false} cursor={false} />
            {renderBars(barChartKeysAndColor)}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ paddingBottom: `${data.length * 3.6}%` }} />
    </div>
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
  barChartKeysAndColor: null,
};

export default Chart;
