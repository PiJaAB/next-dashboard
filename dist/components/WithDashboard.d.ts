import React from 'react';
import type { DashboardComponent } from '../utils/types';
import { Config } from '../utils/configContext';
import defaultStrings from '../utils/dashboardStringsEnglish';
export default function WithDashboard({ config, strings, children, }: {
    config: Config;
    strings?: Partial<Record<keyof typeof defaultStrings, string>>;
    children: React.ReactElement<unknown, DashboardComponent<any>>;
}): JSX.Element;
