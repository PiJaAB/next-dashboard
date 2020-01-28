// @flow
import React, { useState, useEffect } from 'react';
import ResponsiveTable, {
  defaultRenderHead,
  type Props as TableProps,
  type Entry,
  type ColData,
} from './ResponsiveTable';

export type { Entry } from './ResponsiveTable';

type Sort<D: Entry> = void | {|
  field: $Keys<D>,
  dir: 'asc' | 'desc',
|};

type Data<D: Entry> = ?$ReadOnlyArray<D>;

function defaultCompare<D: Entry>(a: D, b: D, field: $Keys<D>): number {
  return String(a[field]).localeCompare(String(b[field]));
}

export type Props<D: Entry> = {
  ...TableProps<D>,
  compare?: (a: D, b: D, field: $Keys<D>) => number,
};

const SortIcon = <D: Entry>({
  col,
  sort,
}: {
  col: ColData<D>,
  sort: Sort<D>,
}) => (
  <span
    className={[
      'fa',
      `fa-sort${
        sort && sort.field === col.field
          ? `-${sort.dir === 'asc' ? 'up' : 'down'}`
          : ''
      }`,
      (!sort || sort.field !== col.field) && 'hidden',
    ]
      .filter(c => c)
      .join(' ')}
  />
);

function MultiResponsiveTable<D: Entry>({
  data: orgData,
  onColumnClick,
  compare,
  renderHead,
  className,
  ...props
}: Props<D>): null | React$Element<
  <D: Entry>(TableProps<D>) => React$Element<'div'>,
> {
  const [data, setData] = useState<Data<D>>(orgData);
  const [sort, setSort] = useState<Sort<D>>();
  useEffect(() => {
    if (data === orgData && !sort) return;
    if (!sort || !orgData) {
      setData(orgData);
      return;
    }
    setData(
      [...orgData].sort((a, b) => {
        const comp = (compare || defaultCompare)(a, b, sort.field);
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

  const wrappedRenderHead = (col: ColData<D>) => (
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
}

MultiResponsiveTable.defaultProps = {
  groupPreproccesor: undefined,
  compare: undefined,
};

export default MultiResponsiveTable;
