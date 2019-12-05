// @flow

import cookies from 'next-cookies';

import type { InitialPropsContext } from './nextTypes';

export type PersistentState = ?{ [string]: any };

let btoa;
let atob;
if (typeof window === 'undefined') {
  /* eslint-disable global-require */
  btoa = require('btoa');
  atob = require('atob');
  /* eslint-enable global-require */
} else {
  ({ btoa, atob } = window);
}

export default function createPersistentState(
  cookieName: string,
  version?: number,
): {
  getInitialState(ctx: InitialPropsContext): PersistentState,
  persist(state: PersistentState): void,
} {
  let latestState = null;
  return {
    getInitialState(ctx: InitialPropsContext): PersistentState {
      const { [cookieName]: dashboardB64 } = cookies(ctx);
      if (!dashboardB64) return null;
      try {
        const dashboardJson = atob(dashboardB64);
        const dashboardState = JSON.parse(dashboardJson);
        if (dashboardState.version !== version) return {};
        return dashboardState.data;
      } catch (err) {
        console.error(err);
        return {};
      }
    },

    persist(state: PersistentState) {
      if (typeof window === 'undefined' || !window.setTimeout) return;
      if (!latestState) {
        window.setTimeout(() => {
          const curState = latestState;
          latestState = null;
          if (!curState) return;
          try {
            window.document.cookie = `${cookieName}=${escape(
              btoa(JSON.stringify({ version, data: curState })),
            )}; path=/`;
          } catch (err) {
            console.error(err);
          }
        }, 100);
      }
      latestState = state;
    },
  };
}
