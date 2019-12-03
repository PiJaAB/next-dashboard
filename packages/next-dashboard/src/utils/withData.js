// @flow
import React from 'react';
import DataComponent, {
  type ErrProps,
  type LoadingProps,
} from './DataComponent';
import type { Statuses } from './types';

type Conf<T> = {
  refiner: mixed => T,
  defaults: {
    error: (err: Error) => T,
    loading: () => T,
  },
};

type Stripped<P: { status: Statuses }> = $Diff<P, { status: Statuses }>;

export default function withData<
  Type,
  Props: { value: Type, status: Statuses },
>(
  Comp: React$ComponentType<Props>,
  { refiner, defaults }: Conf<Type>,
): Class<DataComponent<Type, Stripped<Props>>> {
  return class WrappedData extends DataComponent<Type, Stripped<Props>> {
    constructor() {
      super(refiner);
    }

    renderSuccess(props: Stripped<Props>): React$Node {
      return <Comp {...props} status="success" />;
    }

    renderLoading(props: LoadingProps<Type, Stripped<Props>>): React$Node {
      return <Comp {...props} value={defaults.loading()} status="loading" />;
    }

    renderError({
      error,
      ...props
    }: ErrProps<Type, Stripped<Props>>): React$Node {
      return <Comp {...props} value={defaults.error(error)} status="error" />;
    }
  };
}
