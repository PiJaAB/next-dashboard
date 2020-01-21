// @flow
import Router from 'next/router';

import type { InitialPropsContext } from '../utils/nextTypes';

const redirectTo = (res, path) => {
  if (res) {
    res.writeHead(302, { Location: path });
    res.end();
  } else {
    Router.push(path);
  }
};

function Test(): React$Node {
  return null;
}

Test.getInitialProps = ({ res }: InitialPropsContext) => {
  redirectTo(res, '/dashboard/login');
  return {};
};

export default Test;
