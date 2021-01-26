import React from 'react';

type Props = React.PropsWithChildren<{
  contentContainerWidth?:
    | 'extra-narrow'
    | 'narrow'
    | 'normal'
    | 'wide'
    | 'extra-wide';
  header?: React.ReactNode;
}>;

const Content = ({
  children,
  contentContainerWidth,
  header = true,
}: Props): JSX.Element => (
  <div
    className={['dashboard-content', !header && 'no-header']
      .filter((className) => className)
      .join(' ')}
  >
    <div
      className={[
        'container',
        contentContainerWidth && `container-${contentContainerWidth}`,
      ]
        .filter((className) => className)
        .join(' ')}
    >
      {children}
    </div>
    <div id="right-sidebar-root" />
  </div>
);

export default Content;
