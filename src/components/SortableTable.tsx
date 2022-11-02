import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import ChevronUpIcon from '@heroicons/react/solid/ChevronUpIcon';
import ChevronDownIcon from '@heroicons/react/solid/ChevronDownIcon';
import ResponsiveTable, {
  defaultRenderHead,
  Props as TableProps,
  ColData,
} from './ResponsiveTable';

type Sort =
  | undefined
  | {
      field: string | number | symbol;
      dir: 'asc' | 'desc';
    };

type Data<E extends {}> = readonly E[] | undefined | null;

type Compare<E> = (a: E, b: E, prop: string | number | symbol, dir: 'asc' | 'desc') => number;
type CompareBy<E> = (
  entry: E,
  prop: string | number | symbol,
  dir: 'asc' | 'desc',
) => string | number | null | undefined;

export type Props<E, C> = TableProps<E, C> & {
  compare?: Compare<E>;
  compareBy?: CompareBy<E>;
  title?: string;
};

function getDefaultCompare<E>(compareBy: CompareBy<E>): Compare<E> {
  return (a, b, field, dir) => {
    const av = compareBy(a, field, dir);
    const bv = compareBy(b, field, dir);

    // Make string comparisons locale-sensitive by default
    if (typeof av === 'string' || typeof bv === 'string') {
      return String(av).localeCompare(String(bv));
    }

    if (av == null && b == null) return 0;
    if (av == null) return -1;
    if (bv == null) return 1;

    // Fall back to generic `<` comparison
    if (av < bv) return -1;
    if (av > bv) return +1;
    return 0;
  };
}

const defaultCompareBy = (entry: any, field: string | number | symbol) => entry[field];

function SortIcon<E extends {}, C>({
  col,
  sort,
}: {
  col: ColData<E, C>;
  sort: Sort;
}): JSX.Element {
  const Icon = sort?.dir === 'asc' ? ChevronUpIcon : ChevronDownIcon;
  return (
    <Icon
      className={classNames(
        (!sort || sort.field !== col.field) && 'invisible',
        'h-6 inline-block',
      )}
    />
  );
}

const SortableTable = <
  E extends {} = { [key: string]: unknown },
  C extends {} = {},
>({
  data: orgData,
  onColumnClick,
  compare,
  compareBy,
  renderHead,
  className,
  title,
  ...props
}: Props<E, C>): JSX.Element => {
  const [data, setData] = useState<Data<E>>(orgData);
  const [sort, setSort] = useState<Sort>();

  useEffect(() => {
    setData((oldData) => {
      if (oldData === orgData && !sort) return oldData;
      if (!sort || !orgData) {
        return orgData;
      }
      const comparator =
        compare || getDefaultCompare<E>(compareBy || defaultCompareBy);
      return [...orgData].sort((a, b) => {
        const comp = comparator(a, b, sort.field, sort.dir);
        return sort.dir === 'asc' ? comp : -comp;
      });
    });
  }, [sort, orgData, compare, compareBy]);

  const handleColumnClick = useCallback(
    (col: ColData<E, C>) => {
      if (onColumnClick) onColumnClick(col);
      if (!sort || sort.field !== col.field) {
        setSort({
          field: col.field,
          dir: 'desc',
        });
      } else if (sort.dir === 'asc') {
        setSort(undefined);
      } else {
        setSort({
          ...sort,
          dir: 'asc',
        });
      }
    },
    [onColumnClick, sort],
  );

  const wrappedRenderHead = (col: ColData<E, C>) => (
    <>
      {(renderHead || defaultRenderHead)(col)}{' '}
      <SortIcon col={col} sort={sort} />
    </>
  );

  return (
    <div>
      {title && <h2>{title}</h2>}
      <ResponsiveTable
        className={classNames('sortable-table', className)}
        data={data}
        renderHead={wrappedRenderHead}
        onColumnClick={handleColumnClick}
        {...props}
      />
    </div>
  );
};

export default SortableTable;
