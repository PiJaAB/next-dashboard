// @flow
import React from 'react';

import ResponsiveTable, { type Props } from './ResponsiveTable';

const PageTable = <E extends {}, C>({ className, ...props }: Props<E, C>) => (
  <ResponsiveTable className={`page-table ${className || ''}`} {...props} />
);

export default PageTable;
