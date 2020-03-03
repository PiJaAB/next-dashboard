// @flow
import * as React from 'react';
import classnames from 'classnames';

import type { Statuses } from '../utils/types';

export type Props = {
  label?: React.Node,
  value: React.Node,
  prefix?: React.Node,
  suffix?: React.Node,
  periodValue?: React.Node,
  periodText?: React.Node,
  description?: React.Node,
  status?: Statuses,
  direction?: 'up' | 'down',
  className?: string,
};

function Statistic({
  label,
  value,
  prefix,
  suffix,
  periodValue,
  periodText,
  description,
  status,
  direction,
  className,
  ...rest
}: Props): React.Node {
  return (
    <div
      className={classnames(
        'statistic',
        status && `statistic_status_${status}`,
        direction && `statistic_direction_${direction}`,
        className,
      )}
      {...rest}
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

Statistic.defaultProps = {
  label: undefined,
  prefix: '',
  suffix: '',
  periodValue: undefined,
  periodText: undefined,
  description: undefined,
  status: undefined,
  direction: undefined,
  className: undefined,
};

export default Statistic;
