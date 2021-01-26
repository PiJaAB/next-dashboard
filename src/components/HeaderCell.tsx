import React from 'react';
import classnames from 'classnames';

type Props = React.PropsWithChildren<{
  className?: string;
  type?: string;
  separator?: boolean;
  fullscreenButton?: boolean;
}>;

export default function HeaderCell({
  children,
  type,
  className,
  separator = true,
  fullscreenButton = false,
}: Props): JSX.Element {
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
