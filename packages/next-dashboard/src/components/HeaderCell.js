// @flow

import React from 'react';

export type HeaderCellID = 'search' | 'profile' | 'contact';

type Props = {
  className?: string,
  cellId?: HeaderCellID,
  children: React$Node,
};

export default function HeaderCell({
  children,
  cellId,
  className,
}: Props): React$Node {
  return (
    <div
      className={[
        className,
        'cell',
        'dashboard-header-cell',
        cellId && `dashboard-header-cell_${cellId}`,
      ]
        .filter(c => c)
        .join(' ')}
    >
      {children}
    </div>
  );
}

HeaderCell.defaultProps = {
  className: undefined,
  cellId: undefined,
};
