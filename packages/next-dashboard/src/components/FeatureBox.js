// @flow
import React, { PureComponent } from 'react';

export type Props = {
  icon: string,
  iconBackgroundColor: string,
  label?: React$Node,
  value: string,
  footerComponent: React$Node,
};

export const defaultProps = {
  label: undefined,
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
    } = this.props;
    return (
      <div className="feature_box">
        <div
          className="feature_box_icon"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <i className={`fa ${icon}`} />
        </div>
        <div className="feature_box_label label margin-bottom-x1">{label}</div>
        <div className="feature_box_value margin-bottom-x1">
          <h2>{value}</h2>
        </div>
        <div className="feature_box_footer">{footerComponent}</div>
      </div>
    );
  }
}
