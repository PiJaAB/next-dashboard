// @flow

import cookies from 'next-cookies';

import type { InitialPropsContext } from './nextTypes';

export type State = { [string]: any };

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

export function getInitialState(ctx: InitialPropsContext): State {
  const { dashboardState: dashboardB64 } = cookies(ctx);
  try {
    const dashboardJson = atob(dashboardB64);
    const dashboardState = JSON.parse(dashboardJson);
    return dashboardState;
  } catch (err) {
    console.error(err);
    return {};
  }
}

let latestState = null;

export function persist(state: State) {
  if (typeof window === 'undefined' || !window.setTimeout) return;
  if (!latestState) {
    window.setTimeout(() => {
      const curState = latestState;
      latestState = null;
      if (!curState) return;
      try {
        window.document.cookie = `dashboardState=${escape(
          btoa(JSON.stringify(curState)),
        )}; path=/`;
      } catch (err) {
        console.error(err);
      }
    }, 100);
  }
  latestState = state;
}
