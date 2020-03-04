// @flow
import React from 'react';
/*:: import * as R from 'react'; */

type Props = {
  className?: string,
  children?: R.Node,
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
