// @flow
import React from 'react';
/*:: import * as R from 'react'; */
import classnames from 'classnames';
import LoadingIndicator from './LoadingIndicator';

import type { Statuses } from '../utils/types';

export type Props = {
  icon?: string,
  iconBackgroundColor?: string,
  label?: R.Node,
  value: string | number | void,
  footerComponent?: R.Node,
  status?: Statuses,
  extraStyles?: { [string]: mixed },
  contentFontSize?: number | string,
};

const FeatureBox = ({
  icon,
  iconBackgroundColor,
  label,
  value,
  footerComponent,
  status,
  extraStyles,
  contentFontSize,
}: Props) => {
  return (
    <div
      className={classnames(
        'feature-box',
        status && `feature-box_status_${status}`,
      )}
      style={extraStyles}
    >
      {icon && iconBackgroundColor && (
        <div
          className="feature-box-icon"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <i className={`fa ${icon}`} />
        </div>
      )}
      <div className="feature-box-label label margin-bottom-x1">{label}</div>
      <div className="feature-box-value margin-bottom-x1">
        {status === 'loading' && <LoadingIndicator />}
        <h2 style={{ fontSize: contentFontSize }}>
          {status === 'loading' ? <>&nbsp;</> : value}
        </h2>
      </div>
      {footerComponent && (
        <div className="feature-box-footer">{footerComponent}</div>
      )}
    </div>
  );
};

export default FeatureBox;
