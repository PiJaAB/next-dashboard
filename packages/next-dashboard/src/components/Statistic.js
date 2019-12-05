// @flow
import React, { PureComponent } from 'react';

import type { Statuses } from '../utils/types';

export type Props = {
  label?: string,
  value: string | number,
  description?: string,
  prefix?: string,
  suffix?: string,
  status?: Statuses,
};

export const defaultProps = {
  label: undefined,
  description: undefined,
  status: undefined,
  prefix: '',
  suffix: '',
};

export default class Statistic extends PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const { label, description, value, prefix, suffix, status } = this.props;
    return (
      <div
        className={['statistic', status != null && `statistics-${status}`]
          .filter(c => c)
          .join(' ')}
      >
        <div className="label margin-bottom-x1">
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
