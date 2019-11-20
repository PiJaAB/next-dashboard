// @flow

import React from 'react';

export type Props = {
  children?: React$Node,
};

function DashboardIndex({ children }: Props): React$Element<'div'> {
  return (
    <div>
      <h1>DASHBOARD INDEX</h1>
      {children != null && <div>{children}</div>}
    </div>
  );
}

DashboardIndex.defaultProps = {
  children: undefined,
};

export default DashboardIndex;
