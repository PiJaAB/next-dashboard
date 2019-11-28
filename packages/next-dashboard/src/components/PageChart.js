// @flow
import React from 'react';

import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
} from 'recharts';

const data = [
  {
    name: 'Page A',
    value: 2400,
  },
  {
    name: 'Page B',
    value: 1398,
  },
  {
    name: 'Page C',
    value: 9800,
  },
  {
    name: 'Page D',
    value: 3908,
  },
  {
    name: 'Page E',
    value: 4800,
  },
  {
    name: 'Page F',
    value: 3800,
  },
  {
    name: 'Page G',
    value: 4300,
  },
];

const PageChart = () => (
  <div className="page-chart">
    <div className="page-chart-content">
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip animationDuration={250} />
          <Bar dataKey="value" barSize={20} animationDuration={250} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PageChart;
