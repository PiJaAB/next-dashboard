// @flow
import React, { PureComponent } from 'react';
import DashboardContext, {
  type DashboardContextType,
} from '../../utils/dashboardContext';
import { refineToPrimitive } from '../../utils/dataRefiners';
import Statistic from './Statistic';

type Props = {
  label?: string,
  id: string,
  description?: string,
  prefix?: string,
  suffix?: string,
};

export default class DataStatistic extends PureComponent<Props> {
  context: DashboardContextType;

  static defaultProps = {
    label: undefined,
    description: undefined,
    prefix: '',
    suffix: '',
  };

  static contextType = DashboardContext;

  render() {
    const { id, ...props } = this.props;
    if (!this.context) return null;
    const { data } = this.context;
    try {
      const value = refineToPrimitive(data[id], 'string');
      return <Statistic value={value} {...props} />;
    } catch (err) {
      console.error(err);
      return <Statistic value={err.constructor.name} {...props} />;
    }
  }
}
