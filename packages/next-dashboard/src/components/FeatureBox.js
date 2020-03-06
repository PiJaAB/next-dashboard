// @flow
import React from 'react';
/*:: import * as R from 'react'; */
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
      className={[
        'feature-box',
        'display-flex',
        'flex-direction-column',
        status && `feature-box_status_${status}`,
      ]
        .filter(c => c)
        .join(' ')}
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
      <div className="feature-box-value margin-bottom-x1 display-flex align-items-center flex-grow-1">
        <h2
          style={{
            fontSize: contentFontSize && contentFontSize,
          }}
        >
          {status === 'loading' ? <LoadingIndicator /> : value}
        </h2>
      </div>
      {footerComponent && (
        <div className="feature-box-footer">{footerComponent}</div>
      )}
    </div>
  );
};

FeatureBox.defaultProps = {
  icon: undefined,
  iconBackgroundColor: undefined,
  label: undefined,
  status: undefined,
  footerComponent: undefined,
  extraStyles: {},
  contentFontSize: undefined,
};

export default FeatureBox;
