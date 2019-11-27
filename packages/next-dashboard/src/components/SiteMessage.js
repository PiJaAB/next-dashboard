// @flow
import React from 'react';
import capitalize from '../utils/capitalize';

type Props = {
  title?: string,
  message: string,
  status?: 'info' | 'warning' | 'error',
  count?: number,
  dismiss?: () => void,
};

function SiteMessage({
  title,
  message,
  status,
  count,
  dismiss,
}: Props): React$Node {
  return (
    <div
      className={['site-message', status && `site-message_${status}`]
        .filter(c => c)
        .join(' ')}
    >
      <div className="site-message-header">
        <h2 className="h5-size margin-0">{title || capitalize(status || 'info')}</h2>
        {count && count > 1 && (
          <div className="site-message-count">x{count}</div>
        )}
      </div>
      <div className="site-message-content">
        <p>{message}</p>
      </div>
      {dismiss && (
        <div className="site-message-footer">
          <button
            type="button"
            className="site-message-button"
            onClick={dismiss()}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

SiteMessage.defaultProps = {
  title: undefined,
  status: 'info',
  count: 1,
  dismiss: undefined,
};

export default SiteMessage;
