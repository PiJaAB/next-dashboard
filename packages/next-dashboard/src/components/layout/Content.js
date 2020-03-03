// @flow
import React from 'react';
/*:: import * as R from 'react'; */

type Props = {
  children?: R.Node,
  contentContainerWidth?:
    | 'extra-narrow'
    | 'narrow'
    | 'normal'
    | 'wide'
    | 'extra-wide',
  header?: R.Node,
};

const Content = ({ children, contentContainerWidth, header }: Props) => (
  <div
    className={['dashboard-content', !header && 'no-header']
      .filter(className => className)
      .join(' ')}
  >
    <div
      className={[
        'container',
        contentContainerWidth && `container-${contentContainerWidth}`,
      ]
        .filter(className => className)
        .join(' ')}
    >
      {children}
    </div>
    <div id="right-sidebar-root" />
  </div>
);

Content.defaultProps = {
  children: null,
  contentContainerWidth: undefined,
  header: true,
};

export default Content;
