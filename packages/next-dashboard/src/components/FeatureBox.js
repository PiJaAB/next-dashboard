// @flow
import React, { PureComponent } from 'react';
import type { Statuses } from '../utils/types';

export type Props = {
  icon?: string,
  iconBackgroundColor?: string,
  label?: React$Node,
  value: string | number | void,
  footerComponent?: React$Node,
  status?: Statuses,
  extraStyles?: { [string]: mixed },
};

export const defaultProps = {
  icon: undefined,
  iconBackgroundColor: undefined,
  label: undefined,
  status: undefined,
  footerComponent: undefined,
  extraStyles: {},
};

export default class FeatureBox extends PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const {
      icon,
      iconBackgroundColor,
      label,
      value,
      footerComponent,
      status,
      extraStyles,
    } = this.props;
    return (
      <div
        className={['feature_box', status && `feature_box_status_${status}`]
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
          <h2>{status === 'loading' ? 'Loading...' : value}</h2>
        <div className="feature-box-label label margin-bottom-x1">{label}</div>
        <div className="feature-box-value margin-bottom-x1">
        </div>
        {footerComponent && (
          <div className="feature-box-footer">{footerComponent}</div>
        )}
      </div>
    );
  }
}
