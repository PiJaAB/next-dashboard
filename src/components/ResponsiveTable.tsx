import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import FixedScrollbar from './FixedScrollbar';
import TableHead from './ResponsiveTableHead';

import LoadingIndicator from './LoadingIndicator';

import type { Column as HeadColumn } from './ResponsiveTableHead';

export type ColData<E, C> = C & {
  readonly key?: string;
  readonly title: string;
  readonly field: keyof E;
  readonly htmlTooltip?: boolean;
  readonly useTooltip?: boolean;
};

export type TableColumn<E, C> = ColData<E, C> & {
  readonly renderHead?: (
    column: ColData<E, C>,
  ) => React.ReactNode | null | undefined;
  readonly renderBody?: {
    (entry: E, column: ColData<E, C>, isTooltip?: false):
      | React.ReactNode
      | null
      | undefined;
    (entry: E, column: ColData<E, C>, isTooltip: true):
      | string
      | null
      | undefined;
  };
  renderCell?: (props: {
    row: E;
    column: ColData<E, C>;
    isLabel: boolean;
    children: React.ReactNode;
    dataTip?: string | null;
    dataHtml: boolean;
    className?: string;
  }) => JSX.Element;
  readonly textAlign?: string;
};

export interface Props<E, C> {
  className?: string;
  columns: readonly TableColumn<E, C>[];
  data?: readonly E[] | null;
  renderHead?: (column: ColData<E, C>) => JSX.Element | null;
  renderBody?: {
    (entry: E, column: ColData<E, C>, isTooltip?: false):
      | React.ReactNode
      | null
      | undefined;
    (entry: E, column: ColData<E, C>, isTooltip: true):
      | string
      | null
      | undefined;
  };
  htmlTooltip?: boolean;
  columnKeyExtractor?: (column: ColData<E, C>) => string;
  dataKeyExtractor?: (entry: E) => string;
  onColumnClick?: (column: HeadColumn<E, C>) => void;
  style?: React.CSSProperties;
  rowHeight?: string | number;
  loading?: boolean;
  renderRow?: (props: {
    row: E;
    isLabel: boolean;
    children?: React.ReactNode;
  }) => JSX.Element;
  renderCell?: (props: {
    row: E;
    column: ColData<E, C>;
    isLabel: boolean;
    children: React.ReactNode;
    dataTip?: string | null;
    dataHtml: boolean;
    className?: string;
  }) => JSX.Element;
}

export const defaultRenderHead = ({ title }: ColData<any, any>): JSX.Element =>
  title;
const defaultRenderBody = (entry: any, { field }: ColData<any, any>) =>
  entry[field] !== null ? String(entry[field]) : null;
const defaultKeyExtractor = ({ key }: ColData<any, any>) => key;
const defaultColumnKeyExtractor = ({ field, key }: ColData<any, any>) =>
  key || field;

const defaultRenderRow = ({ children }: { children?: React.ReactNode }) => {
  return <tr>{children}</tr>;
};
const defaultRenderCell = ({
  children,
  dataTip,
  dataHtml,
  className,
}: {
  children?: React.ReactNode;
  dataTip?: string | null;
  dataHtml: boolean;
  className?: string;
}) => {
  return (
    <td data-tip={dataTip} data-html={dataHtml} className={className}>
      {children}
    </td>
  );
};

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
  htmlTooltip = false,
  loading,
  renderRow: RenderRow = defaultRenderRow,
  renderCell = defaultRenderCell,
}: Props<E, C>): JSX.Element => {
  const textAlignClass = (alignment?: string) =>
    alignment && `text-align-${alignment}`;
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [data]);
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
          data.map((entry) => (
            <RenderRow
              row={entry}
              isLabel={type === 'head'}
              key={dataKeyExtractor(entry)}
            >
              {cols.map((column) => {
                const RenderCell = column.renderCell || renderCell;
                return (
                  <RenderCell
                    row={entry}
                    column={column}
                    isLabel={type === 'head'}
                    dataTip={
                      (
                        column.useTooltip == null
                          ? type === 'head'
                          : column.useTooltip
                      )
                        ? (column.renderBody || renderBody)(entry, column, true)
                        : null
                    }
                    dataHtml={
                      column.htmlTooltip != null
                        ? column.htmlTooltip
                        : htmlTooltip
                    }
                    key={columnKeyExtractor(column)}
                    className={textAlignClass(column.textAlign)}
                  >
                    {(column.renderBody || renderBody)(entry, column, false)}
                  </RenderCell>
                );
              })}
            </RenderRow>
          ))}
      </tbody>
    </table>
  );
  return (
    <div
      style={style}
      className={['responsive-table flex-direction-column', className]
        .filter((c) => c)
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
