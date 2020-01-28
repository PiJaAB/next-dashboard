// @flow
import React from 'react';

import ResponsiveTable, { type Props, type Entry } from './ResponsiveTable';

const PageTable = <D: Entry>({ className, ...props }: Props<D>) => (
  <ResponsiveTable className={`page-table ${className || ''}`} {...props} />
);

export default PageTable;
