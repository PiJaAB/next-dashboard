// @flow
import React from 'react';

type Props = {
  className?: string,
  children?: React$Node,
};

const PageContent = ({ className, children, ...rest }: Props) => (
  <div
    className={['page-content', className].filter(c => c).join(' ')}
    {...rest}
  >
    {children}
  </div>
);

PageContent.defaultProps = {
  className: '',
  children: null,
};

export default PageContent;
