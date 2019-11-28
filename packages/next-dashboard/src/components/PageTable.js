// @flow
import React from 'react';

import ResponsiveTable from './ResponsiveTable';

type Props = {
  props: mixed,
};

const PageTable = ({ ...props }: Props) => (
  <ResponsiveTable className="page-table" {...props} />
);

export default PageTable;
