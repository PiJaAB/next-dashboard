// @flow

import React from 'react';
import withAuth from 'src/utils/withAuth';

function Test(): React$Element<'div'> {
  return <div>Hello Authenticated user</div>;
}

export default withAuth<{}>(Test);
