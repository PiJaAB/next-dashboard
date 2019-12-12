// @flow
import React from 'react';

type Props = {
  children: React$Node,
};

const PageChart = ({ children }: Props) => (
  <div className="page-chart">
    <div className="page-chart-content">{children}</div>
  </div>
);

export default PageChart;
