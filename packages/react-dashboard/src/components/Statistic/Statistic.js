// @flow
import React, { PureComponent } from 'react';

export type Props = {
  label?: string,
  value?: string,
  description?: string,
  prefix?: string,
  suffix?: string,
  status?: string,
};

export default class Statistic extends PureComponent<Props> {
  static defaultProps = {
    label: undefined,
    value: undefined,
    description: undefined,
    status: undefined,
    prefix: '',
    suffix: '',
  };

  render() {
    const { label, description, value, prefix, suffix, status } = this.props;
    return (
      <div
        className={['statistic', status != null && `statistics-${status}`]
          .filter(c => c)
          .join(' ')}
      >
        <div className="margin-bottom-x1">
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
