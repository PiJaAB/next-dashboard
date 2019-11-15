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
  needAuthDefault: boolean,
  isAuthenticated(): Promise<boolean> | boolean,
};

function createDashboardHOC<D: DataProvider>(
  dataProvider: D,
  notLoggedInRoute: string = '/dashboard/login',
): {
  withDashboard<U>(
    Comp: NextComponent<U>,
    needAuth?: boolean,
  ): NextComponent<U>,
  Context: React$Context<D>,
} {
  const Context = React.createContext<D>(dataProvider);

  function withDashboard<P>(
    Comp: NextComponent<P>,
    needAuth?: boolean,
  ): NextComponent<P> {
    const funcComp = (props: P) => (
      <Context.Provider value={dataProvider}>
        <Comp {...props} />
      </Context.Provider>
    );

    // eslint-disable-next-line no-param-reassign
    needAuth = needAuth == null ? dataProvider.needAuthDefault : needAuth;

    if (needAuth || Comp.getInitialProps) {
      funcComp.getInitialProps = async (
        ctx: InitialPropsContext,
      ): Promise<{}> => {
        const authenticated = await dataProvider.isAuthenticated();
        if (needAuth && !authenticated) {
          const { res } = ctx;
          if (res && !authenticated) {
            res.writeHead(302, { Location: notLoggedInRoute });
            res.end();
            return {};
          }

          if (!authenticated) {
            Router.push(notLoggedInRoute);
            return {};
          }
        }

        return (
          (Comp.getInitialProps ? await Comp.getInitialProps(ctx) : null) || {}
        );
      };
    }

    const WrappedComp: NextComponent<P> = funcComp;
    WrappedComp.displayName = `withDashboard(${displayNameOf(Comp)})`;

    return WrappedComp;
  }

  return { withDashboard, Context };
}

export default createDashboardHOC;
