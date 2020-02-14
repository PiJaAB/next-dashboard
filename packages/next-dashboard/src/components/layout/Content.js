// @flow
import React from 'react';

import FullscreenExitButton from '../FullscreenExitButton';

type Props = {
  children?: React$Node,
  contentContainerWidth?:
    | 'extra-narrow'
    | 'narrow'
    | 'normal'
    | 'wide'
    | 'extra-wide',
  header?: React$Node,
};

const Content = ({ children, contentContainerWidth, header }: Props) => (
  <div
    id="dashboard-content"
    className={['dashboard-content', !header && 'no-header']
      .filter(className => className)
      .join(' ')}
  >
    <FullscreenExitButton />
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
  header: true,
};

export default Content;
