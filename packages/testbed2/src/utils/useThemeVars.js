// @flow

import { useContext } from 'react';
import { DashboardContext } from '@pija-ab/next-dashboard';

type Vars = {|
  chartBarColor: string,
  overviewChart: {
    Volume: string,
    Quality: string,
    Resources: string,
    Leadership: string,
    Average: string,
  },
|};

type Themes = {|
  default: Vars,
  dark: $Shape<Vars>,
|};

const themes: Themes = {
  default: {
    chartBarColor: '#4880FF',
    overviewChart: {
      Volume: '#e0ce41',
      Quality: '#89e041',
      Resources: '#c041e0',
      Leadership: '#e07641',
      Average: '#4880FF',
    },
  },
  dark: {},
};

export default function useThemeVars(): Vars {
  const ctx = useContext(DashboardContext);
  if (ctx == null)
    throw new Error('Cannot use theme variables outside a dashboard context');
  let themeName: string;
  if (!Object.keys(themes).includes(ctx.theme.class)) {
    themeName = 'default';
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `Tried to access themevars from unknown theme ${ctx.theme.class}`,
      );
    }
  } else {
    themeName = ctx.theme.class;
  }
  if (themeName === 'default') return themes[themeName];
  return {
    ...themes.default,
    ...themes[themeName],
  };
}
