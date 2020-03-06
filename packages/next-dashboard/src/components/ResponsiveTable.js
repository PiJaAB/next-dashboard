// @flow
import React from 'react';
/*:: import * as R from 'react'; */
import ReactTooltip from 'react-tooltip';

import FixedScrollbar from './FixedScrollbar';
import TableHead from './ResponsiveTableHead';

import type { Column as HeadColumn } from './ResponsiveTableHead';

export type ColData<-E, -C> = $ReadOnly<{
  ...C,
  key?: string,
  title: string,
  field: $Keys<E>,
}>;

export type Column<E, -C> = $ReadOnly<{
  ...ColData<E, C>,
  +renderHead?: (column: ColData<E, C>) => ?R.Node,
  +renderBody?: (entry: E, column: ColData<E, C>) => ?R.Node,
  +textAlign?: string,
}>;

export type Props<E, C> = {
  className?: string,
  columns: $ReadOnlyArray<Column<E, C>>,
  data: ?$ReadOnlyArray<E>,
  renderHead?: (column: ColData<E, C>) => ?R.Node,
  renderBody?: (entry: E, column: ColData<E, C>) => ?R.Node,
  columnKeyExtractor?: (column: ColData<E, C>) => string,
  dataKeyExtractor?: (entry: E) => string,
  onColumnClick?: (column: HeadColumn<E, C>) => void,
  style?: ?{ [string]: mixed },
  rowHeight?: string | number,
};

export type TextAlignProps = { +textAlign: string | void };

export const defaultRenderHead = <-E, -C>({ title }: ColData<E, C>) => title;
const defaultRenderBody = <E: {}, C>(entry: E, { field }: ColData<E, C>) =>
  entry[field] !== null ? String(entry[field]) : null;
const defaultKeyExtractor = <E, C>({ key }: { key?: string } | ColData<E, C>) =>
  key;
const defaultColumnKeyExtractor = <E, C>({ field, key }: ColData<E, C>) =>
  key || field;

const ResponsiveTable = <-E: {}, -C>({
  className,
  columns,
  data,
  renderHead = defaultRenderHead,
  renderBody = defaultRenderBody,
  columnKeyExtractor = defaultColumnKeyExtractor,
  dataKeyExtractor = defaultKeyExtractor,
  onColumnClick,
  style,
  rowHeight,
}: Props<E, C>) => {
  const textAlignClass = (props: TextAlignProps) =>
    props.textAlign && `text-align-${props.textAlign}`;
  const table = (cols: $ReadOnlyArray<Column<E, C>>, type: string) => (
    <table>
      <TableHead
        cols={cols}
        columnKeyExtractor={columnKeyExtractor}
        textAlignClass={textAlignClass}
        renderHead={renderHead}
        onColumnClick={onColumnClick}
      />
      <tbody
        style={{
          lineHeight:
            typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight,
        }}
      >
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
    <div
      style={style}
      className={['responsive-table', className].filter(c => c).join(' ')}
    >
      <div className="responsive-table-head">{table([columns[0]], 'head')}</div>
      <FixedScrollbar className="responsive-table-body">
        {table(columns.slice(1), 'body')}
      </FixedScrollbar>
      <ReactTooltip className="tooltip-style" />
    </div>
  );
};

export default ResponsiveTable;
