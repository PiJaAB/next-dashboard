// @flow
import React from 'react';

type Props = {
  children?: React$Node,
};

const PageContent = ({ children }: Props) => (
  <div className="page-content">
    <div className="container">{children}</div>
  </div>
);

PageContent.defaultProps = {
  children: null,
};

export default PageContent;
