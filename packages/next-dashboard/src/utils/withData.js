// @flow
import React from 'react';
/*:: import * as R from 'react'; */

import type {
  Statuses,
  DataExtra,
  DataType,
  ISubscriptionProvider,
} from './types';

import displayNameOf from './displayNameOf';
import useData from './useData';

type Conf<T> = {
  defaults: {
    error: (err: Error) => T,
    loading: () => T,
  },
};

type Stripped<T, P: { status: Statuses, value: T }, Data> = {
  ...$Diff<P, { status: Statuses, value: T }>,
  parser: (DataType<$ElementType<Data, string>>) => T,
  dataSource: $Keys<Data>,
  extra?: DataExtra,
};

const defaultProps = {
  path: undefined,
  extra: undefined,
};

export default function withData<
  Type,
  Data: {},
  Props: { value: Type, status: Statuses },
>(
  Comp: R.ComponentType<Props>,
  subProvider: ISubscriptionProvider<Data>,
  { defaults }: Conf<Type>,
): R.ComponentType<Stripped<Type, Props, Data>> {
  function WrappedComp(
    props: Stripped<Type, Props, Data>,
  ): R.Element<typeof Comp> {
    const { dataSource, parser, extra, ...restProps } = props;
    const data = useData(subProvider, dataSource, extra);
    if (data.status === 'success') {
      return <Comp status="success" value={parser(data)} {...restProps} />;
    }
    if (data.status === 'error') {
      return (
        <Comp
          status="error"
          value={defaults.error(data.error)}
          {...restProps}
        />
      );
    }
    return <Comp status="loading" value={defaults.loading()} {...restProps} />;
  }

  WrappedComp.defaultProps = defaultProps;
  WrappedComp.displayName = `withData(${displayNameOf(Comp)})`;

  return WrappedComp;
}
