// @flow
import React from 'react';

import type { Statuses, DataExtra, DataPath, DataType } from './types';

import displayNameOf from './displayNameOf';
import useData from './useData';

type Conf<T> = {
  refiner: mixed => T,
  defaults: {
    error: (err: Error) => T,
    loading: () => T,
  },
};

type Stripped<T, P: { status: Statuses, value: T }> = {
  ...$Diff<P, { status: Statuses, value: T }>,
  dataSource: string,
  path?: DataPath,
  extra?: DataExtra,
};

const defaultProps = {
  path: undefined,
  extra: undefined,
};

export default function withData<
  Type,
  Props: { value: Type, status: Statuses },
>(
  Comp: React$ComponentType<Props>,
  { refiner, defaults }: Conf<Type>,
): React$ComponentType<Stripped<Type, Props>> {
  function WrappedComp(
    props: Stripped<Type, Props>,
  ): React$Element<typeof Comp> {
    const { dataSource, path, extra, ...restProps } = props;
    const data: DataType<> = useData(dataSource, path, extra);
    if (data.status === 'success') {
      return (
        <Comp status="success" value={refiner(data.value)} {...restProps} />
      );
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
