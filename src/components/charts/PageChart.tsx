import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
function PageChart({ children }: React.PropsWithChildren<{}>): JSX.Element {
  return (
    <div className="page-chart">
      <div className="page-chart-content">{children}</div>
    </div>
  );
}

export default PageChart;
