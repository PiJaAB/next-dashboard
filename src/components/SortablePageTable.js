// @flow
import React from 'react';

import SortableTable, { type Props } from './SortableTable';

const PageTable = <E: {}, C: {}>({ className, ...props }: Props<E, C>) => (
  <SortableTable className={`page-table ${className || ''}`} {...props} />
);

export default PageTable;
