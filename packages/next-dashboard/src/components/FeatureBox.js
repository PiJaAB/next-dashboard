// @flow
import React, { PureComponent } from 'react';
import type { Statuses } from '../utils/types';

export type Props = {
  icon: string,
  iconBackgroundColor: string,
  label?: React$Node,
  value: string,
  footerComponent: React$Node,
  status?: Statuses,
};

export const defaultProps = {
  label: undefined,
  status: undefined,
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
    } = this.props;
    return (
      <div
        className={['feature_box', status && `feature_box_status_${status}`]
          .filter(c => c)
          .join(' ')}
      >
        <div
          className="feature_box_icon"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <i className={`fa ${icon}`} />
        </div>
        <div className="feature_box_label label margin-bottom-x1">{label}</div>
        <div className="feature_box_value margin-bottom-x1">
          <h2>{status === 'loading' ? 'Loading...' : value}</h2>
        </div>
        <div className="feature_box_footer">{footerComponent}</div>
      </div>
    );
  }
}
