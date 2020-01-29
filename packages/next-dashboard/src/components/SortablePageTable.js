// @flow
import React from 'react';

import SortableTable, { type Props } from './SortableTable';

const PageTable = ({ className, ...props }: Props) => (
  <SortableTable className={`page-table ${className || ''}`} {...props} />
);

export default PageTable;
