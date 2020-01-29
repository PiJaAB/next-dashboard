// @flow
import React from 'react';
import ReactTooltip from 'react-tooltip';

import FixedScrollbar from './FixedScrollbar';
import TableHead from './ResponsiveTableHead';

import type { Column as HeadColumn } from './ResponsiveTableHead';

export type Entry = {
  +key?: string,
  +[string]: mixed,
};

export type ColData = $ReadOnly<{
  key?: string,
  title: string,
  field: string,
}>;

export type Column = $ReadOnly<{
  ...ColData,
  +renderHead?: (column: ColData) => ?React$Node,
  +renderBody?: (entry: Entry, column: ColData) => ?React$Node,
  +textAlign?: string,
}>;

export type Props = {
  className?: string,
  columns: $ReadOnlyArray<Column>,
  data: ?$ReadOnlyArray<Entry>,
  renderHead?: (column: ColData) => ?React$Node,
  renderBody?: (entry: Entry, column: ColData) => ?React$Node,
  columnKeyExtractor?: (column: ColData) => string,
  dataKeyExtractor?: (entry: Entry) => string,
  onColumnClick?: (column: HeadColumn) => void,
  style?: ?{ [string]: mixed },
};

export type TextAlignProps = { +textAlign: string | void };

export const defaultRenderHead = ({ title }: ColData) => title;
const defaultRenderBody = (entry: Entry, { field }: ColData) =>
  entry[field] !== null ? String(entry[field]) : null;
const defaultKeyExtractor = ({ key }: Entry | ColData) => key;

const ResponsiveTable = ({
  className,
  columns,
  data,
  renderHead = defaultRenderHead,
  renderBody = defaultRenderBody,
  columnKeyExtractor = defaultKeyExtractor,
  dataKeyExtractor = defaultKeyExtractor,
  onColumnClick,
  style,
}: Props) => {
  const textAlignClass = (props: TextAlignProps) =>
    props.textAlign && `text-align-${props.textAlign}`;
  const table = (cols: $ReadOnlyArray<Column>, type: string) => (
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

ResponsiveTable.defaultProps = {
  className: undefined,
  renderHead: defaultRenderHead,
  renderBody: defaultRenderBody,
  columnKeyExtractor: defaultKeyExtractor,
  dataKeyExtractor: defaultKeyExtractor,
  onColumnClick: undefined,
  style: undefined,
};

export default ResponsiveTable;
