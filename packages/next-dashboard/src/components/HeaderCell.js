// @flow

import React from 'react';
/*:: import * as R from 'react'; */
import classnames from 'classnames';

type Props = {
  className?: string,
  type?: string,
  separator?: boolean,
  children: R.Node,
};

export default function HeaderCell({
  children,
  type,
  className,
  separator,
}: Props): R.Node {
  return (
    <div
      className={classnames(
        className,
        'cell',
        'dashboard-header-cell',
        type && `dashboard-header-cell_${type}`,
        separator && 'dashboard-header-cell_separator',
      )}
    >
      {children}
    </div>
  );
}

HeaderCell.defaultProps = {
  className: undefined,
  type: undefined,
  separator: true,
};
