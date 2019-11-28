// @flow
import React from 'react';

import ResponsiveTable, { type Props } from './ResponsiveTable';

const PageTable = (props: Props) => (
  <ResponsiveTable className="page-table" {...props} />
);

export default PageTable;
