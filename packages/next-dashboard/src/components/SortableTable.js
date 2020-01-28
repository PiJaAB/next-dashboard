// @flow
import React, { useState, useEffect } from 'react';
import ResponsiveTable, {
  type Props as TableProps,
  type Entry,
} from './ResponsiveTable';

export type { Entry } from './ResponsiveTable';

type Sort<D: Entry> = void | {|
  field: $Keys<D>,
  dir: 'ASC' | 'DESC',
|};

export type Props<D: Entry> = {
  ...TableProps<D>,
  compare: (a: D, b: D, field: $Keys<D>) => number,
};

function MultiResponsiveTable<D: Entry>({
  data: orgData,
  onColumnClick,
  compare,
  ...props
}: Props<D>): null | React$Element<
  <D: Entry>(TableProps<D | null>) => React$Element<'div'>,
> {
  const [data, setData] = useState(orgData);
  const [sort, setSort] = useState<Sort<D>>();
  useEffect(() => {
    if (data === orgData && !sort) return;
    if (!sort) {
      setData(orgData);
      return;
    }
    setData(
      [...orgData].sort((a, b) => {
        const comp = compare(a, b, sort.field);
        return sort.dir === 'ASC' ? comp : -comp;
      }),
    );
  }, [sort, orgData]);
  const handleColumnClick = col => {
    if (onColumnClick) onColumnClick(col);
    if (!sort) {
      setSort({
        field: col.field,
        dir: 'DESC',
      });
    } else if (sort.dir === 'ASC') {
      setSort();
    } else {
      setSort({
        ...sort,
        dir: 'ASC',
      });
    }
  };
  return (
    <ResponsiveTable data={data} onColumnClick={handleColumnClick} {...props} />
  );
}

MultiResponsiveTable.defaultProps = {
  groupPreproccesor: undefined,
};

export default MultiResponsiveTable;
