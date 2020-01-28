// @flow
import React from 'react';
import {
  Legend,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import PageChart from './PageChart';

type Props = {
  plots: {
    name: string,
    fill: string,
    stroke: string,
    value: ?number,
  }[],
  children?: React$Node,
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  fill,
}: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
  fill: string,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="pie-chart-label-text"
      >
        {Math.round(percent * 100)}%
      </text>
      <line
        x1={x > cx ? 30 : -30}
        x2="0"
        y1="15"
        y2="15"
        className="pie-chart-label-line"
        style={{ stroke: fill }}
      />
    </g>
  );
};

export default function PieChart({
  plots,
  children,
}: Props): React$Element<typeof PageChart> {
  return (
    <PageChart>
      <ResponsiveContainer>
        <RechartPieChart>
          {children}
          <Tooltip isAnimationActive={false} />
          <Legend
            key="pie-chart-key"
            verticalAlign="bottom"
            iconType="circle"
            content={({ payload }) => (
              <ul className="pie-chart-types-list">
                {payload.map(entry => (
                  <li key={entry.value} className="pie-chart-type">
                    <div
                      className="pie-chart-type-color"
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.value}
                  </li>
                ))}
              </ul>
            )}
          />
          <Pie
            data={plots}
            dataKey="value"
            nameKey="name"
            labelLine={false}
            label={renderCustomizedLabel}
          />
        </RechartPieChart>
      </ResponsiveContainer>
    </PageChart>
  );
}

PieChart.defaultProps = {
  children: undefined,
};
