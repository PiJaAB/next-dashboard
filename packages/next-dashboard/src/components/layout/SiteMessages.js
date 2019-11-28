// @flow

import React from 'react';
import SiteMessage from '../SiteMessage';
import DashboardContext from '../../utils/dashboardContext';

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
        {({ siteMessages }) => <>Woop</>}
      </DashboardContext.Consumer>
    </div>
  );
}

export default SiteMessages;
