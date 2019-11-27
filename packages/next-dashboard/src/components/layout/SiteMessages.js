// @flow

import React from 'react';
import SiteMessage from '../SiteMessage';

function SiteMessages(): React$Node {
  return (
    <div className="site-messages">
      {/*<noscript>*/}
      <SiteMessage
        count={2}
        dismiss={() => {}}
        status="warning"
        message="You need JavaScript enabled for this dashboard to function properly. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum. Sed posuere consectetur est at lobortis. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Curabitur blandit tempus porttitor. Nullam id dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."
      />
      {/*</noscript>*/}
    </div>
  );
}

export default SiteMessages;
