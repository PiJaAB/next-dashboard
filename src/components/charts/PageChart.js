// @flow
import React from 'react';
/*:: import * as R from 'react'; */

function PageChart({ children }: { children?: R.Node }): R.Node {
  return (
    <div className="page-chart">
      <div className="page-chart-content">{children}</div>
    </div>
  );
}

export default PageChart;
