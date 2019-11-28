// @flow
import React, { PureComponent } from 'react';
import DashboardContext, {
  type DashboardContextType,
} from '../../utils/dashboardContext';
import {
  refineDataToPrimitive,
  refineToPrimitive,
} from '../../utils/dataRefiners';
import Statistic from './Statistic';

type Props = {
  label?: string,
  id: string,
  index?: number | string,
  description?: string,
  prefix?: string,
  suffix?: string,
};

export default class DataStatistic extends PureComponent<Props> {
  context: DashboardContextType;

  static defaultProps = {
    index: undefined,
    label: undefined,
    description: undefined,
    prefix: '',
    suffix: '',
  };

  static contextType = DashboardContext;

  renderError(err?: Error) {
    if (err) {
      setTimeout(() => {
        const { context } = this;
        context.registerSiteMessage(err);
      }, 0);
    }
    const { description, label } = this.props;
    return <Statistic value="Failed" description={description} label={label} />;
  }

  renderLoading() {
    const { description, label } = this.props;
    return (
      <Statistic value="Loading..." description={description} label={label} />
    );
  }

  render() {
    const { id, index, ...props } = this.props;
    if (!this.context) return null;
    const { data } = this.context;
    try {
      const entry = data[id];
      if (entry == null) {
        throw new Error(
          'Could not find data entry. Did you register a datafetcher?',
        );
      }
      if (entry.status === 'loading') {
        this.renderLoading();
      }
      let value;
      if (index == null) {
        value = refineDataToPrimitive(entry, 'string');
      } else if (typeof index === 'number') {
        value = refineToPrimitive(
          refineDataToPrimitive(entry, 'array')[index],
          'string',
        );
      } else {
        value = refineToPrimitive(
          refineDataToPrimitive(entry, 'object')[index],
          'string',
        );
      }
      return <Statistic value={value} {...props} />;
    } catch (err) {
      return this.renderError(err);
    }
  }
}
