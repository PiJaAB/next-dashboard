import React from 'react';

import type {
  Statuses,
  DataExtra,
  DataType,
  ISubscriptionProvider,
} from './types';

import displayNameOf from './displayNameOf';
import useData from '../hooks/useData';

type Conf<T> = {
  defaults: {
    error: (err: Error) => T,
    loading: () => T,
  },
};

interface InnerProps<Type, Data extends {}, DS extends keyof Data> {
  parser: (data: DataType<Data[DS]>) => Type;
  dataSource: DS;
  extra?: DataExtra;
}

type NeverInner = {
  [key in keyof InnerProps<never, never, never>]?: never | undefined;
};

export default function withData<
  Type,
  Data extends {},
  Props extends {
    value: Type;
    status: Statuses;
  },
>(
  Comp: React.ComponentType<Omit<Props, keyof InnerProps<any, any, any>>>,
  subProvider: ISubscriptionProvider<Data>,
  { defaults }: Conf<Type>,
): <DS extends keyof Data>(
  props: Omit<Props, keyof InnerProps<any, any, any> | 'status' | 'value'> & InnerProps<Type, Data, DS>,
) => JSX.Element {
  function WrappedComp<DS extends keyof Data>(
    props: Omit<Props, keyof InnerProps<any, any, any> | 'status' | 'value'> & InnerProps<Type, Data, DS>,
  ): JSX.Element {
    const { dataSource, parser, extra, ...restProps } = props;
    const data = useData(subProvider, dataSource, extra);
    if (data.status === 'success') {
      const compProps = {
        ...restProps,
        status: 'success',
        value: parser(data),
      } as unknown as Omit<Props, keyof InnerProps<any, any, any>>;
      return <Comp {...compProps} />;
    }
    if (data.status === 'error') {
      const compProps = {
        ...restProps,
        status: 'error',
        value: defaults.error(data.error),
      } as unknown as Omit<Props, keyof InnerProps<any, any, any>>;
      return (
        <Comp
          {...compProps}
        />
      );
    }
    const compProps = {
      ...restProps,
      status: 'loading',
      value: defaults.loading(),
    } as unknown as Omit<Props, keyof InnerProps<any, any, any>>;
    return <Comp {...compProps} />;
  }
  WrappedComp.displayName = `withData(${displayNameOf(Comp)})`;

  return WrappedComp;
}
