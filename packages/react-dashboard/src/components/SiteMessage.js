// @flow
import React from 'react';

type Props = {
  message: string,
  status?: 'info' | 'warning' | 'error',
  count?: number,
  dismiss?: () => void,
};

function SiteMessage({ message, status, count, dismiss }: Props): React$Node {
  return (
    <div
      className={['sitemessage', status && `sitemessage-${status}`]
        .filter(c => c)
        .join(' ')}
    >
      <div className="sitemessage-text">{message}</div>
      {count && count > 1 && <div className="sitemessage-badge">x{count}</div>}
      {dismiss ? (
        <button type="button" className="sitemessage-count" onClick={dismiss()}>
          X
        </button>
      ) : (
        <button
          type="button"
          tabIndex="-1"
          className="sitemessage-count"
          style={{ visibility: 'hidden' }}
        >
          X
        </button>
      )}
    </div>
  );
}

SiteMessage.defaultProps = {
  status: 'info',
  count: 1,
  dismiss: undefined,
};

export default SiteMessage;
