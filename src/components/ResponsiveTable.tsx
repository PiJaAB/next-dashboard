import React from 'react';
import ReactTooltip from 'react-tooltip';

import FixedScrollbar from './FixedScrollbar';
import TableHead from './ResponsiveTableHead';

import LoadingIndicator from './LoadingIndicator';

import type { Column as HeadColumn } from './ResponsiveTableHead';

export type ColData<E, C> = C & {
  readonly key?: string;
  readonly title: string;
  readonly field: keyof E;
}

export type TableColumn<E, C> = ColData<E, C> & {
  readonly renderHead?: (
    column: ColData<E, C>,
  ) => React.ReactNode | null | undefined;
  readonly renderBody?: (
    entry: E,
    column: ColData<E, C>,
  ) => React.ReactNode | null | undefined;
  readonly textAlign?: string;
}

export interface Props<E, C> {
  className?: string;
  columns: readonly TableColumn<E, C>[];
  data?: readonly E[] | null;
  renderHead?: (column: ColData<E, C>) => JSX.Element | null;
  renderBody?: (
    entry: E,
    column: ColData<E, C>,
  ) => React.ReactNode | null | undefined;
  columnKeyExtractor?: (column: ColData<E, C>) => string;
  dataKeyExtractor?: (entry: E) => string;
  onColumnClick?: (column: HeadColumn<E, C>) => void;
  style?: React.CSSProperties;
  rowHeight?: string | number;
  loading?: boolean;
}

export const defaultRenderHead = ({ title }: ColData<any, any>) => title;
const defaultRenderBody = (entry: any, { field }: ColData<any, any>) =>
  entry[field] !== null ? String(entry[field]) : null;
const defaultKeyExtractor = ({ key }: ColData<any, any>) =>
  key;
const defaultColumnKeyExtractor = ({ field, key }: ColData<any, any>) =>
  key || field;

const ResponsiveTable = <E extends {}, C>({
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
  loading,
}: Props<E, C>) => {
  const textAlignClass = (alignment?: string) =>
    alignment && `text-align-${alignment}`;
  const table = (cols: readonly TableColumn<E, C>[], type: string) => (
    <table>
      <TableHead
        cols={cols as readonly HeadColumn<E, C>[]}
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
                  className={textAlignClass(column.textAlign)}
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
      className={['responsive-table flex-direction-column', className]
        .filter(c => c)
        .join(' ')}
    >
      <div className="display-flex">
        <div className="responsive-table-head">
          {table([columns[0]], 'head')}
        </div>
        <FixedScrollbar className="responsive-table-body">
          {table(columns.slice(1), 'body')}
        </FixedScrollbar>
      </div>
      {loading && (
        <div className="loading-indicator-container">
          <LoadingIndicator />
        </div>
      )}
      <ReactTooltip className="tooltip-style" />
    </div>
  );
};

export default ResponsiveTable;
