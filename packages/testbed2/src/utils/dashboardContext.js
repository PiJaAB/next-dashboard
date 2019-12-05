// @flow
import {
  DashboardContext as RawContext,
  type IDashboardContext,
} from '@pija-ab/next-dashboard';
import XzaxtProvider, { type Data } from 'src/utils/dataProvider';

export type DashboardContextType = IDashboardContext<
  Data,
  XzaxtProvider,
> | void;
const DashboardContext: React$Context<DashboardContextType> = (RawContext: any);
const { Provider, Consumer } = DashboardContext;
export { DashboardContext as Context, Provider, Consumer };
