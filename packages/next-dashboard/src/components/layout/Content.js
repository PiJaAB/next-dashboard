// @flow
import React from 'react';

type Props = {
  children?: React$Node,
  contentContainerWidth?:
    | 'extra-narrow'
    | 'narrow'
    | 'normal'
    | 'wide'
    | 'extra-wide',
};

const Content = ({ children, contentContainerWidth }: Props) => (
  <div className="dashboard-content">
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
  </div>
);

Content.defaultProps = {
  children: null,
  contentContainerWidth: undefined,
};

export default Content;
