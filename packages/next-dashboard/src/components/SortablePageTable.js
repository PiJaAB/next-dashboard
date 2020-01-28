// @flow
import React from 'react';

import SortableTable, { type Props, type Entry } from './SortableTable';

const PageTable = <D: Entry>({ className, ...props }: Props<D>) => (
  <SortableTable className={`page-table ${className || ''}`} {...props} />
);

export default PageTable;
