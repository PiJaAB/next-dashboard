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
import LoadingIndicator from './LoadingIndicator';
import { DataNotFound } from './utils';

type Props = {
  title: string;
  data: {
    Fullname: string;
    loggedtime: number;
    utilization: number;
  }[];
  loading?: boolean;
  barChartKeysAndColor?:
    | null
    | { key: string; color: string }
    | { key: string; color: string; stackId?: string }[];
};

function renderBars(barChartKeysAndColor: Props['barChartKeysAndColor']) {
  if (barChartKeysAndColor) {
    if (Array.isArray(barChartKeysAndColor)) {
      return barChartKeysAndColor.map(({ key, color, stackId }, index) => (
        <Bar
          key={key}
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
}

export default function Chart({
  title,
  data,
  loading = false,
  barChartKeysAndColor,
}: Props): JSX.Element {
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
                  {payload?.map((entry) => (
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

  const renderLoading = () => (
    <div className="chart-loading-container">
      <LoadingIndicator />
    </div>
  );

  return (
    <div className="page-content" style={{ padding: 0 }}>
      <h2 className="line-chart-title-container h3-size">{title}</h2>
      {loading && renderLoading()}
      {(!data || data.length < 1) && !loading ? <DataNotFound /> : chart}
    </div>
  );
}
