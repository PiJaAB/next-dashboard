// @flow
import React, { PureComponent } from 'react';

import type { Statuses } from '../utils/types';

export type Props = {
  label?: React$Node,
  value: React$Node,
  prefix?: React$Node,
  suffix?: React$Node,
  periodValue?: React$Node,
  periodText?: React$Node,
  description?: React$Node,
  status?: Statuses,
  direction?: 'up' | 'down',
};

export const defaultProps = {
  label: undefined,
  prefix: '',
  suffix: '',
  periodValue: undefined,
  periodText: undefined,
  description: undefined,
  status: undefined,
  direction: undefined,
};

export default class Statistic extends PureComponent<Props> {
  static defaultProps = defaultProps;

  render() {
    const {
      label,
      value,
      prefix,
      suffix,
      periodValue,
      periodText,
      description,
      status,
      direction,
    } = this.props;
    return (
      <div
        className={[
          'statistic',
          status && `statistic_status_${status}`,
          direction && `statistic_direction_${direction}`,
        ]
          .filter(c => c)
          .join(' ')}
      >
        <div className="label margin-bottom-x1">
          {label != null ? label : <>&nbsp;</>}
        </div>
        <h2 className="margin-bottom-x1">
          {prefix}
          {value}
          {suffix}
        </h2>
        {(periodValue || periodText) && (
          <p>
            {direction && (
              <img
                className="statistic-period-icon"
                src={`/images/statistic/statistic-direction-icon-${direction}.svg`}
                alt=""
              />
            )}
            <span className="statistic-period-value">{periodValue}</span>{' '}
            {periodText}
          </p>
        )}
        {description != null && <p>{description}</p>}
      </div>
    );
  }
}
