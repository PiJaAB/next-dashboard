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
  positive?: 'up' | 'down' | 'n/a',
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
  positive = 'up',
  ...rest
}: Props): R.Node {
  const isLoading = status === 'loading';
  let isNegative = false;
  let isPositive = false;
  if (positive === 'down') {
    isPositive = direction === 'down';
    isNegative = direction === 'up';
  } else if (positive === 'up') {
    isPositive = direction === 'up';
    isNegative = direction === 'down';
  }
  let subjective = 'neutral';
  if (isPositive) subjective = 'positive';
  if (isNegative) subjective = 'negative';
  return (
    <div
      className={classnames(
        'statistic',
        status && `statistic_status_${status}`,
        direction && `statistic_direction_${direction}`,
        isPositive && 'statistic_positive',
        isNegative && 'statistic_negative',
        className,
      )}
      {...rest}
    >
      <div className="label margin-bottom-x1">
        {label != null ? label : <>&nbsp;</>}
      </div>
      <div className="statistic-value margin-bottom-x1">
        {isLoading && <LoadingIndicator />}
        <h2>
          {prefix}
          {isLoading ? <>&nbsp;</> : value}
          {suffix}
        </h2>
      </div>
      {(periodValue || periodText) && (
        <p
          className={classnames(
            'statistic-footer',
            isLoading && 'statistic-footer_loading',
          )}
        >
          {direction && (
            <img
              className="statistic-period-icon"
              src={`/images/statistic/statistic-${subjective}-direction-icon-${direction}.svg`}
              alt={direction === 'up' ? 'Upp' : 'Ner'}
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
