// @flow
import React from 'react';

import ResponsiveTable, { type Props } from './ResponsiveTable';

const PageTable = ({ className, ...props }: Props) => (
  <ResponsiveTable className={`page-table ${className || ''}`} {...props} />
);

export default PageTable;
