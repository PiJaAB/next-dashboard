// @flow

import React from 'react';
import type { InitialPropsContext, NextComponent } from 'src/utils/nextTypes';
import displayNameOf from 'src/utils/displayNameOf';
import Router from 'next/router';

export type DataProvider = {
  update<T>(key: string, data: T, extra: { [string]: mixed }): Promise<void>,
  data: {
    [string]:
      | {
          status: 'success',
          value: mixed,
        }
      | {
          status: 'error',
          error: Error,
        }
      | {
          status: 'loading',
        },
  },
  isAuthenticated(): Promise<boolean> | boolean,
};

export type Config = {
  unauthedRoute?: string,
  needAuthDefault: boolean,
  errorComponent?: NextComponent<{}>,
};

type WrappedProps<P> =
  | (P & { __RENDER_ERROR__?: false })
  | {
      __RENDER_ERROR__: true,
      errProps: {},
    };

type WrappedFuncComp<P> = {
  (
    props: WrappedProps<P>,
  ):
    | null
    | React$Element<
        React$ComponentType<{
          children?: React$Node,
          value: DataProvider | void,
        }>,
      >
    | React$Element<
        React$ComponentType<{}> & {
          +getInitialProps?: (ctx: InitialPropsContext) => Promise<{}>,
        },
      >,
  getInitialProps: (ctx: InitialPropsContext) => Promise<{}>,
  displayName: ?string,
};

function makeStatusError(
  statusCode: number,
  message?: string,
): Error & { statusCode: number } {
  // eslint-disable-next-line flowtype/no-weak-types
  const err: any = new Error(message);
  err.statusCode = statusCode;
  return err;
}

export const DashboardContext = React.createContext<DataProvider | void>();
DashboardContext.displayName = 'DataProvider';

export default function createDashboardHOC<D: DataProvider>(
  dataProvider: D,
  { needAuthDefault, unauthedRoute, errorComponent: ErrorComp }: Config,
): <U: {}>(Comp: NextComponent<U>, needAuth?: boolean) => NextComponent<U> {
  function withDashboard<P: {}>(
    Comp: NextComponent<P>,
    needAuth?: boolean,
  ): NextComponent<P> {
    const WrappedComp: WrappedFuncComp<P> = (props: WrappedProps<P>) => {
      // eslint-disable-next-line no-underscore-dangle,react/destructuring-assignment
      if (props.__RENDER_ERROR__) {
        const { errProps } = props;
        if (ErrorComp) {
          return <ErrorComp {...errProps} />;
        }
        return null;
      }
      const { __RENDER_ERROR__: _, ...rest } = props;
      return (
        <DashboardContext.Provider value={dataProvider}>
          <Comp {...rest} />
        </DashboardContext.Provider>
      );
    };

    // eslint-disable-next-line no-param-reassign
    needAuth = needAuth == null ? needAuthDefault : needAuth;
    WrappedComp.getInitialProps = async (
      ctx: InitialPropsContext,
    ): Promise<{}> => {
      const authenticated = await dataProvider.isAuthenticated();
      if (needAuth && !authenticated) {
        const { res } = ctx;
        if (unauthedRoute) {
          if (res) {
            res.writeHead(302, { Location: unauthedRoute });
            res.end();
            return {};
          }
          Router.push(unauthedRoute);
          return {};
        }

        const statusCode = 401;
        if (res) res.statusCode = 401;
        const err: Error & { statusCode: number } = makeStatusError(
          statusCode,
          'Unauthorized, please log in.',
        );

        if (ErrorComp) {
          const errCtx = { ...ctx, err };
          const retProps = {
            errProps:
              (ErrorComp.getInitialProps
                ? await ErrorComp.getInitialProps(errCtx)
                : null) || {},
            __RENDER_ERROR__: true,
          };
          return retProps;
        }
        throw err;
      }

      return (
        (Comp.getInitialProps ? await Comp.getInitialProps(ctx) : null) || {}
      );
    };

    WrappedComp.displayName = `withDashboard(${displayNameOf(Comp)})`;

    return WrappedComp;
  }

  return withDashboard;
}
