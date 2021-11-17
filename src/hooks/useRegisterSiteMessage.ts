import { useContext } from 'react';
import { SiteMessageType } from '../utils/types';
import DashboardContext from '../utils/dashboardContext';

export default function useRegisterSiteMessage(): (
  siteMessages: Error | SiteMessageType,
) => void {
  const { registerSiteMessage } = useContext(DashboardContext);
  return registerSiteMessage;
}
