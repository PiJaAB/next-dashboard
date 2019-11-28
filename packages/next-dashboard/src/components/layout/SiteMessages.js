// @flow

import React from 'react';
import SiteMessage from '../SiteMessage';
import DashboardContext from '../../utils/dashboardContext';
import type { SiteMessageType } from '../../utils/types';

function siteMessageKey(m: SiteMessageType): string {
  return `${m.title ? `${m.title}-` : ''}${
    m.status ? `${m.status}-` : 'info-'
  }${m.message ? m.message : ''}`;
}

function SiteMessages(): React$Node {
  return (
    <div className="site-messages">
      <noscript>
        <SiteMessage
          status="warning"
          message="You need JavaScript enabled for this dashboard to function properly."
        />
      </noscript>
      <DashboardContext.Consumer>
        {ctx =>
          ctx != null &&
          ctx.siteMessages.map(siteMessage => (
            <SiteMessage
              key={siteMessageKey(siteMessage)}
              {...siteMessage}
              dismiss={() => ctx.dismissSiteMessage(siteMessage)}
            />
          ))
        }
      </DashboardContext.Consumer>
    </div>
  );
}

export default SiteMessages;
