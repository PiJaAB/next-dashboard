// @flow
import React from 'react';
import ReactTooltip from 'react-tooltip';

import FixedScrollbar from './FixedScrollbar';
import TableHead from './ResponsiveTableHead';

import type { Column as HeadColumn } from './ResponsiveTableHead';

export type Entry = {
  +key?: string,
};

export type ColData<D: Entry> = $ReadOnly<{
  key?: string,
  title: string,
  field: $Keys<D>,
}>;

type Column<D: Entry> = $ReadOnly<{
  ...ColData<D>,
  +renderHead?: (column: ColData<D>) => ?React$Node,
  +renderBody?: (entry: D, column: ColData<D>) => ?React$Node,
  +textAlign?: string,
}>;

export type Props<D: Entry> = {
  className?: string,
  columns: $ReadOnlyArray<Column<D>>,
  data: ?$ReadOnlyArray<D>,
  renderHead?: (column: ColData<D>) => ?React$Node,
  renderBody?: (entry: D, column: ColData<D>) => ?React$Node,
  columnKeyExtractor?: (column: ColData<D>) => string,
  dataKeyExtractor?: (entry: D) => string,
  onColumnClick?: (column: HeadColumn<D>) => void,
};

export type TextAlignProps = { +textAlign: string | void };

const defaultRenderHead = <D: Entry>({ title }: ColData<D>) => title;
const defaultRenderBody = <D: Entry>(entry: D, { field }: ColData<D>) =>
  entry[field] !== null ? String(entry[field]) : null;
const defaultKeyExtractor = <D: Entry>({ key }: Entry | ColData<D>) => key;

const ResponsiveTable = <D: Entry>({
  className,
  columns,
  data,
  renderHead = defaultRenderHead,
  renderBody = defaultRenderBody,
  columnKeyExtractor = defaultKeyExtractor,
  dataKeyExtractor = defaultKeyExtractor,
  onColumnClick,
}: Props<D>) => {
  const textAlignClass = (props: TextAlignProps) =>
    props.textAlign && `text-align-${props.textAlign}`;
  const table = (cols: $ReadOnlyArray<Column<D>>, type: string) => (
    <table>
      <TableHead
        cols={cols}
        columnKeyExtractor={columnKeyExtractor}
        textAlignClass={textAlignClass}
        renderHead={renderHead}
        onColumnClick={onColumnClick}
      />
      <tbody>
        {data &&
          data.map(entry => (
            <tr key={dataKeyExtractor(entry)}>
              {cols.map(column => (
                <td
                  data-tip={
                    type === 'head'
                      ? (column.renderBody || renderBody)(entry, column)
                      : null
                  }
                  key={columnKeyExtractor(column)}
                  className={textAlignClass(column)}
                >
                  {(column.renderBody || renderBody)(entry, column)}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
  return (
    <div className={['responsive-table', className].filter(c => c).join(' ')}>
      <div className="responsive-table-head">{table([columns[0]], 'head')}</div>
      <FixedScrollbar className="responsive-table-body">
        {table(columns.slice(1), 'body')}
      </FixedScrollbar>
      <ReactTooltip className="tooltip-style" />
    </div>
  );
};

ResponsiveTable.defaultProps = {
  className: undefined,
  renderHead: defaultRenderHead,
  renderBody: defaultRenderBody,
  columnKeyExtractor: defaultKeyExtractor,
  dataKeyExtractor: defaultKeyExtractor,
  onColumnClick: undefined,
};

export default ResponsiveTable;
