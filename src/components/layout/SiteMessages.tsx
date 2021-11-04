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
      <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-3">
          <noscript>
            <SiteMessage
              status="warning"
              message="You need JavaScript enabled for this dashboard to function properly."
            />
          </noscript>
          <DashboardContext.Consumer>
            {(ctx) =>
              ctx != null &&
              ctx.siteMessages.length > 0 &&
              ctx.siteMessages.map((siteMessage) => (
                <SiteMessage
                  key={siteMessageKey(siteMessage)}
                  {...siteMessage}
                  dismiss={() => ctx.dismissSiteMessage(siteMessage)}
                />
              ))
            }
          </DashboardContext.Consumer>
        </div>
      </div>
    </>
  );
}

export default SiteMessages;
