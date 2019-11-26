// @flow

import React, { PureComponent } from 'react';
import Router from 'next/router';

import type { NextComponent, InitialPropsContext } from './nextTypes';
import type { DataProvider, DataType, Theme } from './types';
import displayNameOf from './displayNameOf';

import { getInitialState, persist } from './persistentState';
import DashboardContext from './dashboardContext';

export type WrappedProps<P> =
  | (P & {
      __RENDER_ERROR__?: false,
      __INITIAL_STATE__: { [string]: any },
      __INITIAL_DATA__: { [string]: DataType },
    })
  | {
      __RENDER_ERROR__: true,
      __INITIAL_STATE__: void,
      __INITIAL_DATA__: void,
      errProps: {},
    };

type State = {
  data: { [string]: DataType },
  persistentState: { [string]: any },
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

export type Config = {
  unauthedRoute?: string,
  needAuthDefault: boolean,
  errorComponent?: NextComponent<any>,
  themes?: Theme[],
};

export default function createDashboardHOC<D: DataProvider>(
  dataProvider: D,
  {
    needAuthDefault,
    unauthedRoute,
    errorComponent: ErrorComp,
    themes: confThemes,
  }: Config,
): <U: {}>(Comp: NextComponent<U>, needAuth?: boolean) => NextComponent<U> {
  function withDashboard<P: {}>(
    Comp: NextComponent<P>,
    needAuth?: boolean,
  ): NextComponent<P> {
    // eslint-disable-next-line no-param-reassign
    needAuth = needAuth == null ? needAuthDefault : needAuth;
    const themes: Theme[] = confThemes || [
      { name: 'Light', class: 'default' },
      { name: 'Dark', class: 'dark' },
    ];
    class WrappedComp extends PureComponent<WrappedProps<P>, State> {
      state: State;

      static displayName = `withDashboard(${displayNameOf(Comp)})`;

      constructor(props: WrappedProps<P>) {
        super(props);
        // eslint-disable-next-line no-underscore-dangle
        const { __INITIAL_STATE__, __INITIAL_DATA__ } = props;
        this.state = {
          persistentState: __INITIAL_STATE__ || {},
          data: __INITIAL_DATA__ || {},
        };
      }

      static async getInitialProps(ctx: InitialPropsContext): Promise<{}> {
        const { pathname, query, asPath } = ctx;
        const authenticated =
          dataProvider &&
          (await dataProvider.isAuthorizedForRoute(pathname, asPath, query));
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

        return {
          ...((Comp.getInitialProps ? await Comp.getInitialProps(ctx) : null) ||
            {}),
          __INITIAL_STATE__: getInitialState(ctx),
          __INITIAL_DATA__: dataProvider.getCurrentData(),
        };
      }

      getPersistentState: <T>(key: string, defaultValue: T) => T = (
        key,
        defaultValue,
      ) => {
        const { persistentState } = this.state;
        if (typeof persistentState[key] !== 'undefined')
          return persistentState[key];
        return (defaultValue /*:any */);
      };

      setPersistentState: <T>(key: string, value: T) => void = (key, value) => {
        this.setState(curState => {
          if (curState.persistentState[key] === value) return {};
          const newPersistentState = {
            ...curState.persistentState,
            [key]: value,
          };
          persist(newPersistentState);
          return {
            persistentState: newPersistentState,
          };
        });
      };

      render() {
        const { state, props } = this;
        // eslint-disable-next-line no-underscore-dangle,react/destructuring-assignment
        if (props.__RENDER_ERROR__) {
          const { errProps } = props;
          if (ErrorComp) {
            return <ErrorComp {...errProps} />;
          }
          return null;
        }
        const { persistentState } = state;
        const theme: Theme = themes.find(
          t => t.class === persistentState.theme,
        ) ||
          themes[0] || { name: 'Default', class: 'default' };
        const { __RENDER_ERROR__: _, ...rest } = props;
        const context = {
          ...dataProvider,
          getState: this.getPersistentState,
          setState: this.setPersistentState,
          themes,
          theme,
          data: state.data,
        };
        return (
          <DashboardContext.Provider value={context}>
            <Comp {...rest} />
          </DashboardContext.Provider>
        );
      }
    }

    return (WrappedComp /*:any */);
  }

  return withDashboard;
}