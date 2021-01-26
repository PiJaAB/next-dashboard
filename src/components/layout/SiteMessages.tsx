import React from 'react';
import SiteMessage from '../SiteMessage';
import DashboardContext from '../../utils/dashboardContext';
import type { SiteMessageType } from '../../utils/types';

function siteMessageKey(m: SiteMessageType): string {
  return `${m.title ? `${m.title}-` : ''}${
    m.status ? `${m.status}-` : 'info-'
  }${m.message ? m.message : ''}`;
}

function SiteMessages(): JSX.Element {
  return (
    <>
      <noscript>
        <div className="site-messages site-messages_no-script">
          <SiteMessage
            status="warning"
            message="You need JavaScript enabled for this dashboard to function properly."
          />
        </div>
      </noscript>
      <DashboardContext.Consumer>
        {(ctx) =>
          ctx != null &&
          ctx.siteMessages.length > 0 && (
            <div className="site-messages">
              {ctx.siteMessages.map((siteMessage) => (
                <SiteMessage
                  key={siteMessageKey(siteMessage)}
                  {...siteMessage}
                  dismiss={() => ctx.dismissSiteMessage(siteMessage)}
                />
              ))}
            </div>
          )
        }
      </DashboardContext.Consumer>
    </>
  );
}

export default SiteMessages;
