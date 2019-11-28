// @flow
import React from 'react';

type Entry = {
  key?: string,
  [string]: mixed,
};

type Column = {
  key?: string,
  title: string,
  field: string,
  renderHead?: (column: Column) => ?React$Node,
  renderBody?: (entry: Entry, column: Column) => ?React$Node,
  textAlign?: string,
};

export type Props = {
  className?: string,
  columns: Column[],
  data: Entry[],
  renderHead?: (column: Column) => ?React$Node,
  renderBody?: (entry: Entry, column: Column) => ?React$Node,
  columnKeyExtractor?: (column: Column) => string,
  dataKeyExtractor?: (entry: Entry) => string,
};

type TextAlignProps = { textAlign: string | void };

const defaultRenderHead = ({ title }: Column) => title;
const defaultRenderBody = (entry: Entry, { field }: Column) =>
  String(entry[field]);
const defaultKeyExtractor = ({ key }: Entry | Column) => key;

const ResponsiveTable = ({
  className,
  columns,
  data,
  renderHead = defaultRenderHead,
  renderBody = defaultRenderBody,
  columnKeyExtractor = defaultKeyExtractor,
  dataKeyExtractor = defaultKeyExtractor,
}: Props) => {
  const textAlignClass = (props: TextAlignProps) =>
    props.textAlign && `text-align-${props.textAlign}`;
  const table = (cols: Column[]) => (
    <table>
      <thead>
        <tr>
          {cols.map(column => (
            <th
              key={columnKeyExtractor(column)}
              className={textAlignClass(column)}
            >
              {(column.renderHead || renderHead)(column)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(entry => (
          <tr key={dataKeyExtractor(entry)}>
            {cols.map(column => (
              <td
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
      <div className="responsive-table-head">{table([columns[0]])}</div>
      <div className="responsive-table-body">{table(columns.slice(1))}</div>
    </div>
  );
};

ResponsiveTable.defaultProps = {
  className: undefined,
  renderHead: defaultRenderHead,
  renderBody: defaultRenderBody,
  columnKeyExtractor: defaultKeyExtractor,
  dataKeyExtractor: defaultKeyExtractor,
};

export default ResponsiveTable;
