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
import { DataNotFound } from './utils';

type Props<D: {}> = {
  title?: string,
  data: $ReadOnlyArray<D>,
  loading?: boolean,
  barChartKeysAndColor?: $ReadOnlyArray<{
    +key: string,
    +color: string,
    +stackId: string,
  }>,
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

const Chart = <D: {}>({
  title,
  data,
  loading,
  barChartKeysAndColor,
}: Props<D>) => {
  const chart = (
    <div
      className="page-chart vertical-bar-chart-container stacked-vertical-bar-chart"
      style={{ height: '100%' }}
    >
      <div className="page-chart-content">
        <div
          className="feature-box-label label margin-bottom-x1"
          style={{ fontSize: '1.4rem', fontWeight: 500 }}
        >
          {title}
        </div>
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
            />
            <Legend
              content={({ payload }) => (
                <ul className="stacked-vertical-bar-chart-legends-list">
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

  return (
    <div className="page-content" style={{ padding: 0, height: '100%' }}>
      {(!data || data.length < 1) && !loading ? <DataNotFound /> : chart}
    </div>
  );
};

Chart.defaultProps = {
  loading: false,
  barChartKeysAndColor: null,
  title: undefined,
};

export default Chart;
