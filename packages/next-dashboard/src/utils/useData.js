// @flow

import { useContext, useEffect } from 'react';

import DashboardContext from './dashboardContext';
import type {
  DataType,
  PathFragment,
  SuccessDataType,
  DataExtra,
} from './types';
import { refinePath } from './dataRefiners';
import generateDataKey from './generateDataKey';

type UseData = {
  (string, ?PathFragment, void | DataExtra): $NonMaybeType<DataType<>>,
  (
    string,
    { +[string]: PathFragment },
    void | DataExtra,
  ): $NonMaybeType<DataType<{ +[string]: mixed }>>,
};

function getNestedValue(value: mixed, path: PathFragment): mixed {
  if (Array.isArray(path)) {
    return refinePath(value, path);
  }
  if (typeof path === 'string') {
    if (typeof value !== 'object' || value === null) {
      throw new TypeError(
        `Expected Object in path resolution, got ${
          value === null ? 'null' : typeof value
        }`,
      );
    }
    return value[path];
  }
  if (!Array.isArray(value)) {
    throw new TypeError(
      `Expected Object in path resolution, got ${
        value === null ? 'null' : typeof value
      }`,
    );
  }
  return value[path];
}

function useMulti(
  data: SuccessDataType<>,
  path: { +[string]: PathFragment },
): SuccessDataType<{ +[string]: mixed }> {
  const { value, ...meta } = data;
  const keys = Object.keys(path);
  const values: { +[string]: mixed } = keys.reduce((vals, key) => {
    // eslint-disable-next-line no-param-reassign
    vals[key] = getNestedValue(value, path[key]);
    return vals;
  }, ({}: { [string]: mixed }));
  return {
    ...meta,
    value: values,
  };
}

function useSingle(
  data: SuccessDataType<>,
  path: ?PathFragment,
): SuccessDataType<> {
  if (path == null) return data;
  const { value, ...meta } = data;
  return {
    ...meta,
    value: getNestedValue(value, path),
  };
}

const useData: UseData = (dataSource, path, extra) => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw TypeError('Cannot get data without a context');

  useEffect(() => {
    ctx.dataProvider.listen(dataSource, extra);
    return () => {
      ctx.dataProvider.unListen(dataSource, extra);
    };
  }, [dataSource, extra]);

  const dataKey = generateDataKey(dataSource, extra);
  const { data } = ctx;

  if (data[dataKey] == null) {
    return {
      status: 'loading',
    };
  }

  if (data[dataKey].status !== 'success') {
    return data[dataKey];
  }

  if (typeof path === 'object' && !Array.isArray(path) && path) {
    return useMulti(data[dataKey], path);
  }

  // We've refined the 'path' value to know what
  // return type to use, flow just isn't capable
  // of keeping track of refined input parameters
  // as they relate to return types.
  // $FlowIssue
  return useSingle(data[dataKey], path);
};

export default useData;
