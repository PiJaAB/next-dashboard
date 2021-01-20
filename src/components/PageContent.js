// @flow
import React from 'react';
/*:: import * as R from 'react'; */
import classnames from 'classnames';

type Props = {
  className?: string,
  children?: R.Node,
};

const PageContent = ({ className, children, ...rest }: Props) => (
  <div className={classnames('page-content', className)} {...rest}>
    {children}
  </div>
);

export default PageContent;
