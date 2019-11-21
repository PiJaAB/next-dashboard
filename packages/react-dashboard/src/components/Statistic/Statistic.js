// @flow
import React, { PureComponent } from 'react';

type Props = {
  label?: string,
  value?: string,
  description?: string,
  prefix?: string,
  suffix?: string,
};

export default class Statistic extends PureComponent<Props> {
  static defaultProps = {
    label: undefined,
    value: undefined,
    description: undefined,
    prefix: '',
    suffix: '',
  };

  render() {
    const { label, description, value, prefix, suffix } = this.props;
    return (
      <div className="statistic">
        <div className=".label margin-bottom-x1">
          {label != null ? label : <>&nbsp;</>}
        </div>
        <h2 className="margin-bottom-x1">
          {prefix}
          {value != null ? value : <>&nbsp;</>}
          {suffix}
        </h2>
        <p>{description != null ? description : <>&nbsp;</>}</p>
      </div>
    );
  }
}
