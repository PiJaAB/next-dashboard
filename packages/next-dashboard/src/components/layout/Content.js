// @flow
import React from 'react';

type Props = {
  children?: React$Node,
};

const Content = ({ children }: Props) => (
  <div className="dashboard-content">
    <div className="container">{children}</div>
  </div>
);

Content.defaultProps = {
  children: null,
};

export default Content;
