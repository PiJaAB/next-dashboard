import React from 'react';

import SortableTable, { Props } from './SortableTable';

export default function PageTable<E extends {}, C extends {}>({
  className,
  ...props
}: Props<E, C>) {
  return (
    <SortableTable className={`page-table ${className || ''}`} {...props} />
  );
}
