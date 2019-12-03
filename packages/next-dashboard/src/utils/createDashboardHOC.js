// @flow

import React, { Component } from 'react';
import Router from 'next/router';

import type { NextComponent, InitialPropsContext } from './nextTypes';
import type { DataType, Theme, SiteMessageType } from './types';
import displayNameOf from './displayNameOf';
import PollingProvider from '../dataProviders/PollingProvider';

import createPersistentState from './persistentState';
import DashboardContext, { type IDashboardContext } from './dashboardContext';

export type WrappedProps<P: {}> =
  | {
      ...P,
      __RENDER_ERROR__: false | void,
      __INITIAL_STATE__: { [string]: any },
      __INITIAL_DATA__: { [string]: DataType },
      __COMP__: NextComponent<P>,
      __ERR_PROPS__: void,
    }
  | {
      __RENDER_ERROR__: true,
      __INITIAL_STATE__: { [string]: any },
      __INITIAL_DATA__: { [string]: DataType },
      __COMP__: void,
      __ERR_PROPS__: {},
    };

type State = {
  data: { [string]: DataType },
  persistentState: { [string]: any },
  siteMessages: $ReadOnlyArray<SiteMessageType>,
};

export type Config = {
  unauthedRoute?: string,
  needAuthDefault: boolean,
  error?: {
    Component: NextComponent<any>,
    withContext?: boolean,
  },
  themes?: Theme[],
};

type ExtraCTX = {
  needAuth: boolean,
  Comp: NextComponent<any>,
};

const { getInitialState, persist } = createPersistentState('dashboardState');

function makeStatusError(
  statusCode: number,
  message?: string,
): Error & { statusCode: number } {
  // eslint-disable-next-line flowtype/no-weak-types
  const err: any = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function compareSitemessages(
  m1: SiteMessageType,
  m2: SiteMessageType,
): boolean {
  if (m1.status !== m2.status) return false;
  if (m1.title !== m2.title) return false;
  if (m1.message !== m2.message) return false;
  return true;
}

export default function createDashboardHOC(
  dataProvider: PollingProvider,
  {
    needAuthDefault,
    unauthedRoute,
    error: errorConf,
    themes: confThemes,
  }: Config,
): <U: {}>(Comp: NextComponent<U>, needAuth?: boolean) => NextComponent<U> {
  const themes: Theme[] = confThemes || [
    { name: 'Light', class: 'default' },
    { name: 'Dark', class: 'dark' },
  ];
  let siteMessages: $ReadOnlyArray<SiteMessageType> = [];
  class Dashboard<P: {}> extends Component<WrappedProps<P>, State> {
    state: State;

    constructor(props: WrappedProps<P>) {
      super(props);
      // eslint-disable-next-line no-underscore-dangle
      const { __INITIAL_STATE__, __INITIAL_DATA__ } = props;
      this.state = {
        persistentState: __INITIAL_STATE__ || {},
        data: __INITIAL_DATA__ || {},
        siteMessages: siteMessages || [],
      };
    }

    static async getInitialProps(
      ctx: InitialPropsContext,
      { needAuth, Comp }: ExtraCTX,
    ): Promise<{}> {
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

        if (errorConf) {
          const errCtx = { ...ctx, err };
          const retProps = {
            errProps:
              (errorConf.Component.getInitialProps
                ? await errorConf.Component.getInitialProps(errCtx)
                : null) || {},
            __INITIAL_STATE__: getInitialState(ctx),
            __INITIAL_DATA__: dataProvider.getCurrentData(),
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

    componentDidMount() {
      dataProvider.on('data', this.onData);
      dataProvider.on('error', this.registerSiteMessage);
    }

    componentWillUnmount() {
      dataProvider.off('data', this.onData);
      dataProvider.on('error', this.registerSiteMessage);
    }

    onData: (data: { +[string]: DataType }) => void = data => {
      this.setState(state => ({ data: { ...state.data, ...data } }));
    };

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

    dismissSiteMessage: (siteMessage: SiteMessageType) => void = (
      siteMessage: SiteMessageType,
    ) => {
      this.setState(state => {
        const newMessages = state.siteMessages.filter(
          m => !compareSitemessages(m, siteMessage),
        );
        return {
          siteMessages: newMessages,
        };
      });
    };

    registerSiteMessage: (siteMessage: SiteMessageType | Error) => void = (
      siteMessage: SiteMessageType | Error,
    ) => {
      if (siteMessage instanceof Error) {
        return this.registerSiteMessage({
          title: siteMessage.constructor.name,
          status: 'error',
          message: siteMessage.message,
        });
      }
      this.setState(state => {
        const existingIndex = state.siteMessages.findIndex(m =>
          compareSitemessages(m, siteMessage),
        );
        let newSiteMessages: SiteMessageType[];
        if (existingIndex > -1) {
          newSiteMessages = [...state.siteMessages];
          const updatedMessage = {
            ...state.siteMessages[existingIndex],
            count:
              (state.siteMessages[existingIndex].count != null
                ? state.siteMessages[existingIndex].count
                : 1) + 1,
          };
          newSiteMessages[existingIndex] = updatedMessage;
        } else {
          newSiteMessages = [...state.siteMessages, siteMessage];
        }
        siteMessages = newSiteMessages;
        return {
          siteMessages: newSiteMessages,
        };
      });

      // Incase we want to return something
      // later from this method, I returned
      // the recursive call earlier. Eslint then
      // complained about consistent returns
      // hence `return undefined`
      return undefined;
    };

    render() {
      const { state, props } = this;
      const { persistentState } = state;
      const theme: Theme = themes.find(
        t => t.class === persistentState.theme,
      ) ||
        themes[0] || { name: 'Default', class: 'default' };
      const { __RENDER_ERROR__: _, __COMP__: Comp, ...rest } = props;
      const context: IDashboardContext<PollingProvider> = {
        dataProvider,
        getState: this.getPersistentState,
        setState: this.setPersistentState,
        registerSiteMessage: this.registerSiteMessage,
        dismissSiteMessage: this.dismissSiteMessage,
        siteMessages: state.siteMessages,
        themes,
        theme,
        data: state.data,
      };
      // eslint-disable-next-line no-underscore-dangle,react/destructuring-assignment
      if (props.__RENDER_ERROR__) {
        const { __ERR_PROPS__: errProps } = props;
        if (errorConf) {
          return errorConf.withContext ? (
            <DashboardContext.Provider value={context}>
              <errorConf.Component {...errProps} />
            </DashboardContext.Provider>
          ) : (
            <errorConf.Component {...errProps} />
          );
        }
        return null;
      }
      return (
        Comp != null && (
          <DashboardContext.Provider value={context}>
            <Comp {...rest} />
          </DashboardContext.Provider>
        )
      );
    }
  }

  function withDashboard<P: {}>(
    Comp: NextComponent<P>,
    needAuth?: boolean,
  ): NextComponent<P> {
    if (process.env.NODE_ENV === 'development') {
      const { prototype } = (Comp: any) || {};
      if (prototype && prototype instanceof React.PureComponent) {
        console.warn(
          `Please don't use PureComponent for dashboard root components, Use regular Component instead. Component: ${displayNameOf(
            Comp,
          )}`,
        );
      }
    }
    // eslint-disable-next-line no-param-reassign
    const parsedNeedAuth = needAuth == null ? needAuthDefault : needAuth;

    function WrappedComp(
      props: P,
    ): React$Element<React$AbstractComponent<WrappedProps<P>, Dashboard<P>>> {
      if (
        typeof window !== 'undefined' &&
        !dataProvider.initialized &&
        dataProvider.initialize
      ) {
        dataProvider.initialize({
          asPath: Router.asPath,
          query: Router.query,
          pathname: Router.pathname,
          AppTree() {
            throw new Error("Can't generate AppTree in provider Init");
          },
        });
      }
      const Dash: any = Dashboard;
      return <Dash {...props} __COMP__={Comp} />;
    }

    WrappedComp.getInitialProps = async (ctx: InitialPropsContext) => {
      if (!dataProvider.initialized && dataProvider.initialize) {
        await dataProvider.initialize(ctx);
      }
      return Dashboard.getInitialProps(ctx, {
        needAuth: parsedNeedAuth,
        Comp,
      });
    };

    WrappedComp.displayName = `withDashboard(${displayNameOf(Comp)})`;

    return WrappedComp;
  }

  return withDashboard;
}
