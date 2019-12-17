// @flow

import React, { useState, useEffect } from 'react';
import Router from 'next/router';

import type { NextComponent, InitialPropsContext } from './nextTypes';
import type { Theme, SiteMessageType, IErrorAuthReporter } from './types';
import displayNameOf from './displayNameOf';

import createPersistentState from './persistentState';
import { SilentError } from './silentError';
import DashboardContext, { type IDashboardContext } from './dashboardContext';
import useInitialFlag from './useInitialFlag';

type InitialNormProps<I> = {
  ...I,
  __ERRORED__: false,
  __INITIAL_STATE__: { [string]: any },
  __ERR_PROPS__: void,
};

type InitialErrProps = {
  __ERRORED__: true,
  __INITIAL_STATE__: { [string]: any },
  __ERR_PROPS__: {} | void,
};

type InitialUnified<I> = {
  ...I,
  __ERRORED__: boolean,
  __INITIAL_STATE__: { [string]: any } | void,
  __ERR_PROPS__: {} | void,
};

type InitialProps<I> = InitialErrProps | InitialNormProps<I>;

type WrappedUnified<P: {}, I> = {
  ...P,
  ...InitialUnified<I>,
};

export type WrappedProps<P: {}, I> =
  | {
      ...P,
      ...InitialNormProps<I>,
    }
  | InitialErrProps;

export type Config = {
  errorAuthReporter: IErrorAuthReporter,
  unauthedRoute?: string,
  needAuthDefault: boolean,
  error?: {
    Component:
      | (React$ComponentType<any> & { +getInitialProps: void })
      | NextComponent<any>,
    withContext?: boolean,
  },
  themes?: Theme[],
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

function compareSitemessages(
  m1: SiteMessageType,
  m2: SiteMessageType,
): boolean {
  if (m1.status !== m2.status) return false;
  if (m1.title !== m2.title) return false;
  if (m1.message !== m2.message) return false;
  return true;
}

export default function createDashboardHOC({
  errorAuthReporter,
  needAuthDefault,
  unauthedRoute,
  error: errorConf,
  themes: confThemes,
}: Config): <U: {}, Q: {} = {}>(
  Comp: NextComponent<U, Q>,
  needAuth?: boolean,
) => NextComponent<WrappedUnified<U, Q>, InitialUnified<Q>> {
  const themes: Theme[] = confThemes || [
    { name: 'Light', class: 'default' },
    { name: 'Dark', class: 'dark' },
  ];

  const { getInitialState, persist } = createPersistentState(
    'dashboardState',
    errorAuthReporter,
  );
  let siteMessages: $ReadOnlyArray<SiteMessageType> = [];
  let authInitialized = !errorAuthReporter.initialize;

  function withDashboard<P: {}, I: {} = {}>(
    Comp:
      | (React$ComponentType<P> & { +getInitialProps: void })
      | NextComponent<P, I>,
    needAuth?: boolean,
  ):
    | NextComponent<WrappedUnified<P, I>, InitialUnified<I>>
    | NextComponent<WrappedUnified<P, {}>, InitialUnified<{}>> {
    if (process.env.NODE_ENV === 'development') {
      const { prototype } = (Comp: any) || {};
      if (prototype && prototype instanceof React.PureComponent) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Please don't use PureComponent for dashboard root components, Use regular Component instead. Component: ${displayNameOf(
              Comp,
            )}`,
          );
        }
      }
    }
    // eslint-disable-next-line no-param-reassign
    const parsedNeedAuth = needAuth == null ? needAuthDefault : needAuth;

    function WrappedComp(fullProps: WrappedProps<P, I>): React$Node {
      if (
        typeof window !== 'undefined' &&
        !authInitialized &&
        errorAuthReporter.initialize
      ) {
        authInitialized = true;
        errorAuthReporter.initialize({
          asPath: Router.asPath,
          query: Router.query,
          pathname: Router.pathname,
          AppTree() {
            throw new Error("Can't generate AppTree in provider Init");
          },
        });
      }
      const { __INITIAL_STATE__, ...props } = fullProps;
      const [persistentState, updatePersistentState] = useState(
        __INITIAL_STATE__,
      );
      const [localSiteMessages, setLocalSiteMessages] = useState(siteMessages);

      function getPersistentState<T>(key: string, defaultValue: T): T {
        if (typeof persistentState[key] !== 'undefined')
          return persistentState[key];
        return defaultValue;
      }

      function setPersistentState<T>(key: string, value: T) {
        updatePersistentState(curState => {
          if (curState[key] === value) return curState;
          const newPersistentState = {
            ...curState,
            [key]: value,
          };
          persist(newPersistentState);
          return newPersistentState;
        });
      }

      function registerSiteMessage(siteMessage: SiteMessageType | Error) {
        if (siteMessage instanceof Error) {
          if (siteMessage instanceof SilentError) return;
          // We probably want to log extended debug info if we're throwing
          // an error into the face of the user somewhere, so we can request
          // more info in case we fail to reproduce.
          // eslint-disable-next-line no-restricted-syntax
          console.error(siteMessage);
          registerSiteMessage({
            title: siteMessage.constructor.name,
            status: 'error',
            message: siteMessage.message,
          });
          return;
        }
        const siteMessageAdder: (
          $ReadOnlyArray<SiteMessageType>,
        ) => $ReadOnlyArray<SiteMessageType> = curSiteMessages => {
          const existingIndex = curSiteMessages.findIndex(m =>
            compareSitemessages(m, siteMessage),
          );
          let newSiteMessages: SiteMessageType[];
          if (existingIndex > -1) {
            newSiteMessages = [...curSiteMessages];
            const updatedMessage = {
              ...curSiteMessages[existingIndex],
              count:
                (curSiteMessages[existingIndex].count != null
                  ? curSiteMessages[existingIndex].count
                  : 1) + 1,
            };
            newSiteMessages[existingIndex] = updatedMessage;
          } else {
            newSiteMessages = [...curSiteMessages, siteMessage];
          }
          siteMessages = newSiteMessages;
          return newSiteMessages;
        };

        setLocalSiteMessages(siteMessageAdder);
      }

      function dismissSiteMessage(siteMessage: SiteMessageType) {
        const siteMessageDismisser: (
          $ReadOnlyArray<SiteMessageType>,
        ) => $ReadOnlyArray<SiteMessageType> = curSiteMessages => {
          const newMessages = curSiteMessages.filter(
            m => !compareSitemessages(m, siteMessage),
          );
          return newMessages;
        };
        setLocalSiteMessages(siteMessageDismisser);
      }

      useEffect(() => {
        errorAuthReporter.on('error', registerSiteMessage);
        return () => {
          errorAuthReporter.off('error', registerSiteMessage);
        };
      });

      const initial = useInitialFlag();

      useEffect(() => {
        if (!initial) {
          const htmlEl = document.documentElement;
          if (!htmlEl) return;
          htmlEl.classList.remove('html_initial-render');
        }
      }, [initial]);

      const [modalActive, setModalActive] = useState(false);

      const theme: Theme = themes.find(
        t => t.class === persistentState.theme,
      ) ||
        themes[0] || { name: 'Default', class: 'default' };
      const context: IDashboardContext = {
        isAuthenticated: () => errorAuthReporter.isAuthenticated(),
        getState: getPersistentState,
        setState: setPersistentState,
        registerSiteMessage,
        dismissSiteMessage,
        siteMessages: localSiteMessages,
        themes,
        theme,
        modalActive,
        setModalActive,
      };
      // eslint-disable-next-line no-underscore-dangle,react/destructuring-assignment
      if (props.__ERRORED__) {
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
      const { __ERRORED__: _, ...rest } = props;
      return (
        Comp != null && (
          <DashboardContext.Provider value={context}>
            <Comp {...rest} />
          </DashboardContext.Provider>
        )
      );
    }

    const getInitialProps: InitialPropsContext => Promise<
      InitialProps<$Shape<I> | {}>,
    > = async ctx => {
      if (!authInitialized && errorAuthReporter.initialize) {
        authInitialized = true;
        errorAuthReporter.initialize(ctx);
      }
      const { pathname, query, asPath } = ctx;
      const authenticated =
        errorAuthReporter &&
        (await errorAuthReporter.isAuthorizedForRoute(pathname, asPath, query));
      if (parsedNeedAuth && !authenticated) {
        const { res } = ctx;
        if (unauthedRoute) {
          if (res) {
            res.writeHead(302, {
              Location: `${unauthedRoute}?attemptedURI=${encodeURIComponent(
                asPath,
              )}`,
            });
            res.end();
            return {
              __ERR_PROPS__:
                (errorConf &&
                typeof errorConf.Component.getInitialProps === 'function'
                  ? await errorConf.Component.getInitialProps(ctx)
                  : null) || {},
              __INITIAL_STATE__: getInitialState(ctx) || {},
              __ERRORED__: true,
            };
          }
          Router.push({
            pathname: unauthedRoute,
            query: { attemptedURI: asPath },
          });
          return {
            __ERR_PROPS__:
              (errorConf &&
              typeof errorConf.Component.getInitialProps === 'function'
                ? await errorConf.Component.getInitialProps(ctx)
                : null) || {},
            __INITIAL_STATE__: getInitialState(ctx) || {},
            __ERRORED__: true,
          };
        }

        const statusCode = 401;
        if (res) res.statusCode = 401;
        const err: Error & { statusCode: number } = makeStatusError(
          statusCode,
          'Unauthorized, please log in.',
        );

        if (errorConf) {
          const errCtx = { ...ctx, err };
          return {
            __ERR_PROPS__:
              (typeof errorConf.Component.getInitialProps === 'function'
                ? await errorConf.Component.getInitialProps(errCtx)
                : null) || {},
            __INITIAL_STATE__: getInitialState(ctx) || {},
            __ERRORED__: true,
          };
        }
        throw err;
      }

      if (Comp.getInitialProps) {
        const CompInit = await Comp.getInitialProps(ctx);
        return ({
          ...CompInit,
          __ERRORED__: false,
          __INITIAL_STATE__: getInitialState(ctx) || {},
          __ERR_PROPS__: undefined,
        }: InitialNormProps<I>);
      }
      return ({
        __ERRORED__: false,
        __INITIAL_STATE__: getInitialState(ctx) || {},
        __ERR_PROPS__: undefined,
      }: InitialNormProps<{}>);
    };

    WrappedComp.getInitialProps = getInitialProps;

    WrappedComp.displayName = `withDashboard(${displayNameOf(Comp)})`;

    // $FlowIssue I give up on typing for now, have been sitting with it for a while now...
    return WrappedComp;
  }

  return withDashboard;
}
