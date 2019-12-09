// @flow
import React, { useContext } from 'react';

import type {
  Statuses,
  DataExtra,
  MappedData,
  DataType,
  DataContext,
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
  parser: (MappedData<Data>) => T,
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
  Comp: React$ComponentType<Props>,
  context: DataContext<Data>,
  { defaults }: Conf<Type>,
): React$ComponentType<Stripped<Type, Props, Data>> {
  function WrappedComp(
    props: Stripped<Type, Props, Data>,
  ): React$Element<typeof Comp> {
    const { dataSource, parser, extra, ...restProps } = props;
    const ctx = useContext(context);
    const data: DataType<> = useData(ctx, dataSource, extra);
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
