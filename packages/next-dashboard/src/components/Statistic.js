// @flow
import React from 'react';
/*:: import * as R from 'react'; */
import classnames from 'classnames';
import LoadingIndicator from './LoadingIndicator';
import type { Statuses } from '../utils/types';

export type Props = {
  label?: R.Node,
  value?: R.Node,
  prefix?: R.Node,
  suffix?: R.Node,
  periodValue?: R.Node,
  periodText?: R.Node,
  description?: R.Node,
  status?: Statuses,
  direction?: 'up' | 'down',
  className?: string,
  isLoading?: boolean,
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
  isLoading = false,
  ...rest
}: Props): R.Node {
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
        {isLoading ? <LoadingIndicator /> : value}
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

export default Statistic;
