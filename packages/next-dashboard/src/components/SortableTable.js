// @flow
import React, { useState, useEffect } from 'react';
import ResponsiveTable, {
  defaultRenderHead,
  type Props as TableProps,
  type Entry,
  type ColData,
} from './ResponsiveTable';

export type { Entry } from './ResponsiveTable';

type Sort = void | {|
  field: string,
  dir: 'asc' | 'desc',
|};

type Data = ?$ReadOnlyArray<Entry>;

function defaultCompare(a: Entry, b: Entry, field: string): number {
  return String(a[field]).localeCompare(String(b[field]));
}

export type Props = {
  ...TableProps,
  compare?: (a: Entry, b: Entry, field: string) => number,
};

const SortIcon = ({ col, sort }: { col: ColData, sort: Sort }) => (
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

function SortableTable({
  data: orgData,
  onColumnClick,
  compare,
  renderHead,
  className,
  ...props
}: Props): null | React$Element<(TableProps) => React$Element<'div'>> {
  const [data, setData] = useState<Data>(orgData);
  const [sort, setSort] = useState<Sort>();
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

  const wrappedRenderHead = (col: ColData) => (
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

SortableTable.defaultProps = {
  groupPreproccesor: undefined,
  compare: undefined,
};

export default SortableTable;
