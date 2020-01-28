// @flow
import React from 'react';

import SortableTable, { type Props, type Entry } from './SortableTable';

const PageTable = <D: Entry>(props: Props<D>) => (
  <SortableTable className="page-table" {...props} />
);

export default PageTable;
