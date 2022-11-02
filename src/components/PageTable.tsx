import React from 'react';

import ResponsiveTable, { Props } from './ResponsiveTable';

export default function PageTable<E extends {}, C>({
  className,
  ...props
}: Props<E, C>): JSX.Element {
  return (
    <ResponsiveTable className={`page-table ${className || ''}`} {...props} />
  );
}
