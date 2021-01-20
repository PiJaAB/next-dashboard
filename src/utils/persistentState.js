// @flow

import cookies from 'next-cookies';

import errorReporter from './errorReporter';

import type { InitialPropsContext } from './nextTypes';

let btoa;
let atob;
if (typeof window === 'undefined') {
  /* eslint-disable global-require */
  btoa = global.require('btoa');
  atob = global.require('atob');
  /* eslint-enable global-require */
} else {
  ({ btoa, atob } = window);
}

export type JSONSerializable =
  | string
  | boolean
  | number
  | null
  | $ReadOnlyArray<empty>
  | {};

export default function createPersistentState<
  PersistentState: ?JSONSerializable,
>(
  cookieName: string,
  version?: number,
): {
  getInitialState(ctx: InitialPropsContext | string): PersistentState | null,
  persist(
    state: PersistentState,
    noDebounce?: boolean,
    ctx?: InitialPropsContext | string,
  ): void,
  serialize(state: PersistentState): string,
} {
  let latestState: PersistentState | void;
  let debouncing: ?TimeoutID;
  return {
    getInitialState(ctx: InitialPropsContext | string): PersistentState | null {
      try {
        if (typeof ctx === 'string') {
          const dashboardState = JSON.parse(ctx);
          if (dashboardState.version !== version) return null;
          return dashboardState.data;
        }
        const { [cookieName]: dashboardB64 } = cookies(ctx);
        if (!dashboardB64) return null;
        const dashboardJson = atob(dashboardB64);
        const dashboardState = JSON.parse(dashboardJson);
        if (dashboardState.version !== version) return null;
        return dashboardState.data;
      } catch (err) {
        errorReporter.report(err);
        return null;
      }
    },

    persist(
      state: PersistentState,
      noDebounce?: boolean,
      ctx?: InitialPropsContext | string,
    ) {
      if (typeof window === 'undefined' || !window.setTimeout) {
        if (!ctx || typeof ctx === 'string') return;
        const { res } = ctx;
        if (!res) return;
        if (res.headersSent) return;
        // $FlowIssue: Express.js has res.cookie...
        res.cookie(cookieName, btoa(JSON.stringify({ version, data: state })));
        return;
      }
      if (debouncing == null || noDebounce) {
        if (debouncing != null) clearTimeout(debouncing);
        try {
          window.document.cookie = `${cookieName}=${escape(
            btoa(JSON.stringify({ version, data: state })),
          )}; path=/`;
        } catch (err) {
          errorReporter.report(err);
        }
        const debounce = () => {
          const curState = latestState;
          latestState = undefined;
          if (curState === undefined) {
            debouncing = null;
            return;
          }
          try {
            window.document.cookie = `${cookieName}=${escape(
              btoa(JSON.stringify({ version, data: curState })),
            )}; path=/`;
          } catch (err) {
            errorReporter.report(err);
          }
          debouncing = window.setTimeout(debounce, 100);
        };
        debouncing = window.setTimeout(debounce, 100);
      } else {
        latestState = state;
      }
    },

    serialize(state: PersistentState): string {
      return JSON.stringify({ version, data: state });
    },
  };
}
