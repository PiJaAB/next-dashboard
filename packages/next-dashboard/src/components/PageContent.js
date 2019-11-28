// @flow
import React from 'react';

type Props = {
  children?: React$Node,
};

const PageContent = ({ children }: Props) => (
  <div className="page-content">{children}</div>
);

PageContent.defaultProps = {
  children: null,
};

export default PageContent;
