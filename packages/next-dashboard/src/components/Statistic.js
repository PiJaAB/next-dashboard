// @flow
import React, { PureComponent } from 'react';

import { refineToPrimitive } from '../utils/dataRefiners';
import withData from '../utils/withData';
import type { Statuses, DataProps } from '../utils/types';

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

  static WithData = withData<string | number, DataProps<Props>>(Statistic, {
    refiner: val => refineToPrimitive(val, 'printable'),
    defaults: {
      error: () => 'ERROR!',
      loading: () => 'Loading...',
    },
  });

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
