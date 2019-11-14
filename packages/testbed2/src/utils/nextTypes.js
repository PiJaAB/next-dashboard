// @flow

export type InitialPropsContext = {
  res?: http$ServerResponse,
  req?: http$IncomingMessage<void>,
  asPath: string,
  query: {
    [string]: string | void,
  },
  err?: Error & {
    statusCode: number,
  },
  pathname: string,
  AppTree: () => React$Element<void>,
};

export type RouterType = {
  route: string,
  pathname: string,
  query: { [string]: string | void },
  asPath: string,
};
