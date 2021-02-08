import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
  TooltipFormatter,
} from 'recharts';
import { DataNotFound } from '../utils';
import WrapChart from './WrapChart';

interface BarChartKeyAndColor {
  readonly key: string;
  readonly color: string;
  readonly stackId: string;
}

type Props<D extends {}> = {
  title?: string;
  data: readonly D[];
  loading?: boolean;
  barChartKeysAndColor?: BarChartKeyAndColor[];
  tooltipFormatter?: TooltipFormatter;
};

const renderBars = (
  barChartKeysAndColor: BarChartKeyAndColor | BarChartKeyAndColor[] | undefined,
) => {
  if (barChartKeysAndColor) {
    if (Array.isArray(barChartKeysAndColor)) {
      return barChartKeysAndColor.map(({ key, color, stackId }) => {
        return <Bar key={key} dataKey={key} stackId={stackId} fill={color} />;
      });
    }
    return (
      <Bar
        dataKey={barChartKeysAndColor.key}
        fill={barChartKeysAndColor.color}
      />
    );
  }
  return null;
};

const Chart = <D extends {}>({
  title,
  data,
  loading = false,
  barChartKeysAndColor,
  tooltipFormatter,
}: Props<D>): JSX.Element => {
  const chart = (
    <ResponsiveContainer>
      <WrapChart>
        {(width, height) => (
          <BarChart
            data={data}
            width={width}
            height={height}
            margin={{ top: 0, right: 0, left: 0, bottom: -26 }}
            layout="vertical"
            maxBarSize={12}
            stackOffset="expand"
          >
            <XAxis tick={false} type="number" axisLine={false} />
            <YAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              type="category"
              yAxisId={0}
              width={0}
            />
            <Legend
              content={({ payload }) => (
                <ul
                  className="stacked-vertical-bar-chart-legends-list"
                  style={{ position: 'relative', bottom: '100%' }}
                >
                  {payload?.map(
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
              verticalAlign="bottom"
              margin={{ top: 0, right: 0, left: 0, bottom: 26 }}
              height={26}
            />
            <Tooltip
              isAnimationActive={false}
              cursor={false}
              formatter={tooltipFormatter}
              allowEscapeViewBox={{ x: false, y: true }}
            />
            {renderBars(barChartKeysAndColor)}
          </BarChart>
        )}
      </WrapChart>
    </ResponsiveContainer>
  );

  return (
    <div className="feature-box vertical-bar-chart stacked-vertical-bar-chart">
      <div
        className="feature-box-label label margin-bottom-x1"
        style={{ fontSize: '1.4rem', fontWeight: 500 }}
      >
        {title}
      </div>
      <div className="vertical-bar-chart-container">
        {(!data || data.length < 1) && !loading ? <DataNotFound /> : chart}
      </div>
    </div>
  );
};

export default Chart;
