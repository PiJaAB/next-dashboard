// @flow

import React from 'react';
import classnames from 'classnames';

type Props = {
  className?: string,
  type?: string,
  separator?: boolean,
  children: React$Node,
  fullscreenButton?: boolean,
};

export default function HeaderCell({
  children,
  type,
  className,
  separator,
  fullscreenButton,
}: Props): React$Node {
  return (
    <div
      className={classnames(
        className,
        'cell',
        'dashboard-header-cell',
        type && `dashboard-header-cell_${type}`,
        separator && 'dashboard-header-cell_separator',
        fullscreenButton && 'fullscreen-button-margin',
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
  fullscreenButton: false,
};
