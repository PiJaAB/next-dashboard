// @flow

import React from 'react';

import toClassName from '../utils/toClassName';

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
      className={toClassName([
        className,
        'cell',
        'dashboard-header-cell',
        cellId && `dashboard-header-cell_${cellId}`,
      ])}
    >
      {children}
    </div>
  );
}

HeaderCell.defaultProps = {
  className: undefined,
  cellId: undefined,
};
