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

type Data<E extends {}> = ?$ReadOnlyArray<E>;

type Compare<-E> = (E, E, string, 'asc' | 'desc') => number;
type CompareBy<-E> = (E, string, 'asc' | 'desc') => string | number;

export type Props<-E, -C> = {
  ...TableProps<E, C>,
  compare?: Compare<E>,
  compareBy?: CompareBy<E>,
  title?: string,
};

function getDefaultCompare<E>(compareBy: CompareBy<E>): Compare<E> {
  return (a, b, field, dir) => {
    const av = compareBy(a, field, dir);
    const bv = compareBy(b, field, dir);

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

const SortIcon = <-E extends {}, C>({
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

const SortableTable = <-E extends {} = { +[string]: mixed }, -C: {} = {}>({
  data: orgData,
  onColumnClick,
  compare,
  compareBy,
  renderHead,
  className,
  title,
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
        const comp = comparator(a, b, sort.field, sort.dir);
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
    <div>
      {title && <h2>{title}</h2>}
      <ResponsiveTable
        className={['sortable-table', className].filter(c => c).join(' ')}
        data={data}
        renderHead={wrappedRenderHead}
        onColumnClick={handleColumnClick}
        {...props}
      />
    </div>
  );
};

export default SortableTable;
