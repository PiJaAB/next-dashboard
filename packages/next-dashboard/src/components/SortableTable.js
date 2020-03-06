// @flow
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import ResponsiveTable, {
  defaultRenderHead,
  type Props as TableProps,
  type ColData,
} from './ResponsiveTable';

type Sort = void | {|
  field: string,
  dir: 'asc' | 'desc',
|};

type Data<E: {}> = ?$ReadOnlyArray<E>;

type Compare<-E> = (E, E, string) => number;
type CompareBy<-E> = (E, string) => string | number;

export type Props<-E, -C> = {
  ...TableProps<E, C>,
  compare?: Compare<E>,
  compareBy?: CompareBy<E>,
};

function getDefaultCompare<E>(compareBy: CompareBy<E>): Compare<E> {
  return (a, b, field) => {
    const av = compareBy(a, field);
    const bv = compareBy(b, field);

    // Make string comparisons locale-sensitive by default
    if (typeof av === 'string' || typeof bv === 'string') {
      return String(av).localeCompare(String(bv));
    }

    // Fall back to generic `<` comparison
    if (av < bv) return -1;
    if (av > bv) return +1;
    return 0;
  };
}

const defaultCompareBy = (entry, field) => entry[field];

const SortIcon = <-E: {}, C>({
  col,
  sort,
}: {
  col: ColData<E, C>,
  sort: Sort,
}) => (
  <span
    className={classnames(
      'fa',
      `fa-sort${
        sort && sort.field === col.field
          ? `-${sort.dir === 'asc' ? 'up' : 'down'}`
          : ''
      }`,
      (!sort || sort.field !== col.field) && 'hidden',
    )}
  />
);

const SortableTable = <-E: {} = { +[string]: mixed }, -C: {} = {}>({
  data: orgData,
  onColumnClick,
  compare,
  compareBy,
  renderHead,
  className,
  ...props
}: Props<E, C>) => {
  const [data, setData] = useState<Data<E>>(orgData);
  const [sort, setSort] = useState<Sort>();

  useEffect(() => {
    if (data === orgData && !sort) return;
    if (!sort || !orgData) {
      setData(orgData);
      return;
    }

    const comparator =
      compare || getDefaultCompare<E>(compareBy || defaultCompareBy);

    setData(
      [...orgData].sort((a, b) => {
        const comp = comparator(a, b, sort.field);
        return sort.dir === 'asc' ? comp : -comp;
      }),
    );
  }, [sort, orgData]);

  const handleColumnClick = col => {
    if (onColumnClick) onColumnClick(col);
    if (!sort || sort.field !== col.field) {
      setSort({
        field: col.field,
        dir: 'desc',
      });
    } else if (sort.dir === 'asc') {
      setSort();
    } else {
      setSort({
        ...sort,
        dir: 'asc',
      });
    }
  };

  const wrappedRenderHead = (col: ColData<E, C>) => (
    <>
      {(renderHead || defaultRenderHead)(col)}{' '}
      <SortIcon col={col} sort={sort} />
    </>
  );

  return (
    <ResponsiveTable
      className={['sortable-table', className].filter(c => c).join(' ')}
      data={data}
      renderHead={wrappedRenderHead}
      onColumnClick={handleColumnClick}
      {...props}
    />
  );
};

SortableTable.defaultProps = {
  groupPreproccesor: undefined,
  compare: undefined,
  compareBy: undefined,
};

export default SortableTable;
