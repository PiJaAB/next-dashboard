// @flow

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from 'recharts';
import { currencyFormat } from '../utils/numberFormatters';

type Props = {
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
      return barChartKeysAndColor.map(({ key, color, stackId }) => {
        return (
          <Bar
            key={key}
            dataKey={key}
            barSize={12}
            stackId={stackId}
            fill={color}
          />
        );
      });
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

const Chart = ({ data, loading, barChartKeysAndColor }: Props) => {
  const chart = (
    <div className="page-chart vertical-bar-chart-container">
      <div className="page-chart-content">
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, bottom: 0 }}
            layout="vertical"
            className="vertical-bar-chart"
          >
            <XAxis tick={false} type="number" axisLine={false} />
            <YAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              type="category"
              yAxisId={0}
              width={150}
            />
            <Legend
              content={({ payload }) => (
                <ul className="line-chart-legend-list">
                  {payload.map(
                    (entry, index) =>
                      index < 3 && (
                        <li key={entry.value} className="line-chart-type">
                          <div
                            className="line-chart-type-color"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.value}
                        </li>
                      ),
                  )}
                </ul>
              )}
            />
            <Tooltip
              isAnimationActive={false}
              cursor={false}
              formatter={c => currencyFormat(c)}
            />
            {renderBars(barChartKeysAndColor)}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="stacked-vertical-bar-chart-spacer" />
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

  return (
    <div className="page-content" style={{ padding: 0 }}>
      {(!data || data.length < 1) && !loading ? dataNotFound : chart}
    </div>
  );
};

Chart.defaultProps = {
  loading: false,
  barChartKeysAndColor: null,
};

export default Chart;
