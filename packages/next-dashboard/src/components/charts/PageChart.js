// @flow
import React from 'react';
/*:: import * as R from 'react'; */

type Props = {
  children: R.Node,
};

const PageChart = ({ children }: Props) => (
  <div className="page-chart">
    <div className="page-chart-content">{children}</div>
  </div>
);

export default PageChart;
