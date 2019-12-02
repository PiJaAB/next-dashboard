// @flow
import { Component } from 'react';
import DashboardContext, {
  type DashboardContextType,
} from './dashboardContext';
import {
  refineDataToPrimitive,
  refineToValue,
  refinePath,
} from './dataRefiners';

type Wrapped<T, P: { value: T }> = {
  ...$Diff<P, { value: T }>,
  id: string,
  // eslint-disable-next-line react/require-default-props
  index?: number | string | (number | string)[],
};

export type ErrProps<T, P: { value: T }> = {
  ...$Diff<P, { value: T }>,
  error: Error,
};

export type LoadingProps<T, P: { value: T }> = {
  ...$Diff<P, { value: T }>,
};

const defaultProps = {
  index: undefined,
};

type WrappedDefault<P: {}> = {
  ...P,
  ...typeof defaultProps,
};

function cmpError(err1: ?Error, err2: ?Error): boolean {
  console.log(err1, err2);
  if (err1 === err2) return true;
  if (!err1) return false;
  if (!err2) return false;
  if (err1.constructor !== err2.constructor) return false;
  if (err1.message !== err2.message) return false;
  return true;
}

export default class DataComponent<
  Type,
  Props: { value: Type },
> extends Component<Wrapped<Type, Props>> {
  static genDefaultProps<P: {}>(defProps: P): WrappedDefault<P> {
    return {
      ...defaultProps,
      ...defProps,
    };
  }

  context: DashboardContextType;

  refiner: (val: mixed) => Type;

  lastError: ?Error = null;

  constructor(refiner: (val: mixed) => Type) {
    super();
    this.refiner = refiner;
  }

  componentDidMount() {
    if (!this.context) {
      throw new Error('Attempted to mount DataCompenent without Context');
    }
    const {
      dataProvider: { listen },
    } = this.context;
    const { id } = this.props;
    listen(id);
  }

  componentDidUpdate(prevProps: Wrapped<Type, Props>) {
    const { id: newId } = this.props;
    const { id: oldId } = prevProps;
    if (newId !== oldId) {
      if (!this.context) {
        throw new Error('Attempted to mount DataCompenent without Context');
      }
      const {
        dataProvider: { listen, unListen },
      } = this.context;
      unListen(oldId);
      listen(newId);
    }
  }

  componentWillUnmount() {
    if (!this.context) {
      throw new Error('Attempted to mount DataCompenent without Context');
    }
    const {
      dataProvider: { unListen },
    } = this.context;
    const { id } = this.props;
    unListen(id);
  }

  static contextType = DashboardContext;

  +renderError: (props: ErrProps<Type, Props>) => React$Node;

  handleError(err: Error) {
    if (err && !cmpError(err, this.lastError)) {
      this.lastError = err;
      setTimeout(() => {
        const { context } = this;
        if (!context) {
          console.error(err);
        } else {
          context.registerSiteMessage(err);
        }
      }, 0);
    }
  }

  +renderLoading: (props: LoadingProps<Type, Props>) => React$Node;

  +renderSuccess: (props: Props) => React$Node;

  render() {
    const { id, index, ...props } = this.props;
    if (!this.context) return null;
    const { data } = this.context;
    try {
      const entry = data[id];
      if (entry == null || entry.status === 'loading') {
        return this.renderLoading(props);
      }
      if (entry.status === 'error') {
        this.handleError(entry.error);
        return this.renderError({ ...props, error: entry.error });
      }
      let value;
      if (index == null) {
        value = this.refiner(refineToValue(entry));
      } else if (typeof index === 'number') {
        value = this.refiner(refineDataToPrimitive(entry, 'array')[index]);
      } else if (typeof index === 'string') {
        value = this.refiner(refineDataToPrimitive(entry, 'object')[index]);
      } else if (Array.isArray(index)) {
        value = this.refiner(refinePath(refineToValue(entry), index));
      } else {
        throw new TypeError('Invalid index type');
      }
      return this.renderSuccess({ ...props, value });
    } catch (error) {
      this.handleError(error);
      return this.renderError({ ...props, error });
    }
  }
}
