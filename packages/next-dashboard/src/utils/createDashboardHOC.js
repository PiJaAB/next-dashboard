// @flow

import React, { useState, useEffect } from 'react';
import Router from 'next/router';

import type { NextComponent, InitialPropsContext } from './nextTypes';
import type {
  Branding,
  DashboardComponent,
  IAuthProvider,
  SiteMessageType,
  Theme,
} from './types';
import displayNameOf from './displayNameOf';

import createPersistentState from './persistentState';
import { SilentError } from './silentError';
import DashboardContext, { useNewDashboardContext } from './dashboardContext';
import useInitialFlag from './useInitialFlag';
import errorReporter from './errorReporter';
import logger from './logger';

type PersistDashboardentState = {
  [string]: any,
};

type InitialNormProps<I> = {
  ...I,
  __ERRORED__: false,
  __INITIAL_DASHBOARD_STATE__: PersistDashboardentState,
  __INITIAL_LAYOUT_STATE__: PersistDashboardentState,
  __ERR_PROPS__: void,
  __AUTH_SERIALIZED__: string,
  __PERFORM_SSR__: boolean | void,
};

type InitialErrProps = {
  __ERRORED__: true,
  __INITIAL_DASHBOARD_STATE__: PersistDashboardentState,
  __INITIAL_LAYOUT_STATE__: PersistDashboardentState,
  __ERR_PROPS__: {} | void,
  __AUTH_SERIALIZED__: string,
  __PERFORM_SSR__: boolean | void,
};

type InitialUnified<I> = {
  ...I,
  __ERRORED__: boolean,
  __INITIAL_DASHBOARD_STATE__: PersistDashboardentState | void,
  __INITIAL_LAYOUT_STATE__: PersistDashboardentState | void,
  __ERR_PROPS__: {} | void,
  __AUTH_SERIALIZED__: string,
  __PERFORM_SSR__: boolean | void,
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
  AuthProvider: Class<IAuthProvider>,
  branding: Branding,
  unauthedRoute?: string,
  needAuthDefault: boolean,
  error?: {
    Component:
      | (React$ComponentType<any> & { +getInitialProps: void })
      | NextComponent<any>,
    withContext?: boolean,
  },
  themes?: Theme[],
  ClientAuthComp?: React$ComponentType<any>,
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

const isSSR = typeof window === 'undefined';

export const CLIENT_AUTH = Symbol('Client Auth');

export default function createDashboardHOC({
  AuthProvider,
  needAuthDefault,
  unauthedRoute,
  error: errorConf,
  themes: themesConf,
  branding: brandingConf,
  ClientAuthComp,
}: Config): <U: {}, Q: {} = {}>(
  Comp: DashboardComponent<U, Q>,
  needAuth?: boolean,
) => NextComponent<WrappedUnified<U, Q>, InitialUnified<Q>> {
  const themes: Theme[] = themesConf || [
    { name: 'Light', class: 'default' },
    { name: 'Dark', class: 'dark' },
  ];

  const branding: Branding = brandingConf || {
    name: 'PiJa Next',
  };

  const {
    getInitialState: getInitialDashboardState,
    persist: persistDashboard,
  } = createPersistentState<{}>('dashboardState');
  const {
    getInitialState: getInitialLayoutState,
    persist: persistLayout,
  } = createPersistentState<{}>('dashboardLayoutState');
  let siteMessages: $ReadOnlyArray<SiteMessageType> = [];

  function makeSiteMessageManipulators(
    setLocalSiteMessages: (
      | (($ReadOnlyArray<SiteMessageType>) => $ReadOnlyArray<SiteMessageType>)
      | $ReadOnlyArray<SiteMessageType>,
    ) => void,
  ): [
    (SiteMessageType | Error) => void,
    (siteMessage: SiteMessageType) => void,
  ] {
    const registerSiteMessage = (siteMessage: SiteMessageType | Error) => {
      if (siteMessage instanceof Error) {
        if (siteMessage instanceof SilentError) return;
        logger.error(siteMessage);
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
    };
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
    return [registerSiteMessage, dismissSiteMessage];
  }

  function withDashboard<P: {}, I: {} = {}>(
    Comp: DashboardComponent<P, I>,
    needAuth?: boolean,
  ):
    | NextComponent<WrappedUnified<P, I>, InitialUnified<I>>
    | NextComponent<WrappedUnified<P, {}>, InitialUnified<{}>> {
    if (process.env.NODE_ENV === 'development') {
      const { prototype } = (Comp: any) || {};
      if (prototype && prototype instanceof React.PureComponent) {
        logger.warn(
          `Please don't use PureComponent for dashboard root components, Use regular Component instead. Component: ${displayNameOf(
            Comp,
          )}`,
        );
      }
    }

    const parsedNeedAuth = needAuth == null ? needAuthDefault : needAuth;

    function WrappedComp(fullProps: WrappedProps<P, I>): React$Node {
      const {
        __INITIAL_DASHBOARD_STATE__,
        __INITIAL_LAYOUT_STATE__,
        __AUTH_SERIALIZED__,
        __PERFORM_SSR__,
        ...restProps
      } = fullProps;
      const [localSiteMessages, setLocalSiteMessages] = useState<
        $ReadOnlyArray<SiteMessageType>,
      >(siteMessages);

      const [firstRender, setFirstRender] = useState(true);
      useEffect(() => setFirstRender(false));

      const [
        [registerSiteMessage, dismissSiteMessage],
        setSiteMessageManipulators,
      ] = useState<
        [
          (SiteMessageType | Error) => void,
          (siteMessage: SiteMessageType) => void,
        ],
      >(() => makeSiteMessageManipulators(setLocalSiteMessages));

      useEffect(() => {
        setSiteMessageManipulators(
          makeSiteMessageManipulators(setLocalSiteMessages),
        );
      }, [setLocalSiteMessages]);

      useEffect(() => {
        errorReporter.on('error', registerSiteMessage);
        return () => {
          errorReporter.off('error', registerSiteMessage);
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

      const context = useNewDashboardContext(
        __INITIAL_DASHBOARD_STATE__,
        __INITIAL_LAYOUT_STATE__,
        persistDashboard,
        persistLayout,
        themes,
        localSiteMessages,
        registerSiteMessage,
        dismissSiteMessage,
        branding,
        Comp,
        __AUTH_SERIALIZED__,
        AuthProvider,
      );
      // eslint-disable-next-line no-underscore-dangle
      if (restProps.__ERRORED__) {
        const { __ERR_PROPS__: errProps } = restProps;
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
      const { __ERRORED__: _, ...rest } = restProps;
      let RenderComp = Comp;
      if (__PERFORM_SSR__ != null && !__PERFORM_SSR__ && firstRender) {
        RenderComp = ClientAuthComp;
      }

      return (
        RenderComp != null && (
          <DashboardContext.Provider value={context}>
            <RenderComp {...rest} />
          </DashboardContext.Provider>
        )
      );
    }

    const getInitialProps: InitialPropsContext => Promise<
      InitialProps<$Shape<I> | {}>,
    > = async ctx => {
      const authProvider = new AuthProvider(ctx);
      await authProvider.ready;
      const { pathname, query, asPath } = ctx;
      const authenticated = await authProvider.isAuthorizedForRoute(
        pathname,
        asPath,
        query,
      );
      const performSSR = authenticated && authenticated !== CLIENT_AUTH;
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
              __INITIAL_DASHBOARD_STATE__: getInitialDashboardState(ctx) || {},
              __INITIAL_LAYOUT_STATE__: getInitialLayoutState(ctx) || {},
              __ERRORED__: true,
              __AUTH_SERIALIZED__: authProvider.serialize(),
              __PERFORM_SSR__: isSSR ? performSSR : undefined,
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
            __INITIAL_DASHBOARD_STATE__: getInitialDashboardState(ctx) || {},
            __INITIAL_LAYOUT_STATE__: getInitialLayoutState(ctx) || {},
            __ERRORED__: true,
            __AUTH_SERIALIZED__: authProvider.serialize(),
            __PERFORM_SSR__: isSSR ? performSSR : undefined,
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
            __INITIAL_DASHBOARD_STATE__: getInitialDashboardState(ctx) || {},
            __INITIAL_LAYOUT_STATE__: getInitialLayoutState(ctx) || {},
            __ERRORED__: true,
            __AUTH_SERIALIZED__: authProvider.serialize(),
            __PERFORM_SSR__: isSSR ? performSSR : undefined,
          };
        }
        throw err;
      }

      if (Comp.getInitialProps) {
        const CompInit = await Comp.getInitialProps({ ...ctx, authProvider });
        return ({
          ...CompInit,
          __ERRORED__: false,
          __INITIAL_DASHBOARD_STATE__: getInitialDashboardState(ctx) || {},
          __INITIAL_LAYOUT_STATE__: getInitialLayoutState(ctx) || {},
          __ERR_PROPS__: undefined,
          __AUTH_SERIALIZED__: authProvider.serialize(),
          __PERFORM_SSR__: isSSR ? performSSR : undefined,
        }: InitialNormProps<I>);
      }
      return ({
        __ERRORED__: false,
        __INITIAL_DASHBOARD_STATE__: getInitialDashboardState(ctx) || {},
        __INITIAL_LAYOUT_STATE__: getInitialLayoutState(ctx) || {},
        __ERR_PROPS__: undefined,
        __AUTH_SERIALIZED__: authProvider.serialize(),
        __PERFORM_SSR__: isSSR ? performSSR : undefined,
      }: InitialNormProps<{}>);
    };

    WrappedComp.getInitialProps = getInitialProps;

    WrappedComp.displayName = `withDashboard(${displayNameOf(Comp)})`;

    // $FlowIssue I give up on typing for now, have been sitting with it for a while now...
    return WrappedComp;
  }

  return withDashboard;
}
