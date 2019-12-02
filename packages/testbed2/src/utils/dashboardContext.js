// @flow
import {
  DashboardContext as RawContext,
  type IDashboardContext,
} from '@pija-ab/next-dashboard';
import XzaxtProvider from 'src/utils/dataProvider';

const DashboardContext: React$Context<IDashboardContext<XzaxtProvider> | void> = (RawContext: any);
const { Provider, Consumer } = DashboardContext;
export type DashboardContextType = IDashboardContext<XzaxtProvider> | void;
export { DashboardContext as Context, Provider, Consumer };
