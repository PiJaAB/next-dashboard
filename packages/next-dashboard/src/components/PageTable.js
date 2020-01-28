// @flow
import React from 'react';

import ResponsiveTable, { type Props, type Entry } from './ResponsiveTable';

const PageTable = <D: Entry>(props: Props<D>) => (
  <ResponsiveTable className="page-table" {...props} />
);

export default PageTable;
