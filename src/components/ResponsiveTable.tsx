import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';

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
  readonly renderBody?: (
    entry: E,
    column: ColData<E, C>,
    isTooltip: boolean,
  ) => React.ReactNode | null | undefined;
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
  renderBody?: (
    entry: E,
    column: ColData<E, C>,
    isTooltip: boolean,
  ) => React.ReactNode | null | undefined;
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
  emptyNode?: React.ReactNode;
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
  emptyNode,
}: Props<E, C>): JSX.Element => {
  useEffect(() => {
    ReactTooltip.rebuild();
  }, [data]);
  const table = (cols: readonly TableColumn<E, C>[], type: 'head' | 'body') => (
    <table className={classNames(type === 'head' && 'table-fixed', 'w-full')}>
      <TableHead
        cols={cols as readonly HeadColumn<E, C>[]}
        columnKeyExtractor={columnKeyExtractor}
        renderHead={renderHead}
        onColumnClick={onColumnClick}
        type={type}
      />
      <tbody
        style={{
          lineHeight:
            typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight,
        }}
        className="divide-y divide-gray-500"
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
                        ? ((column.renderBody || renderBody)(
                            entry,
                            column,
                            true,
                          ) as string | undefined | null)
                        : null
                    }
                    dataHtml={
                      column.htmlTooltip != null
                        ? column.htmlTooltip
                        : htmlTooltip
                    }
                    key={columnKeyExtractor(column)}
                    className={classNames(
                      column.textAlign === 'center' && 'text-center',
                      column.textAlign === 'left' && 'text-left',
                      column.textAlign === 'right' && 'text-right',
                      column.textAlign === 'justify' && 'text-justify',
                      type === 'head' &&
                        'overflow-hidden overflow-ellipsis whitespace-nowrap',
                    )}
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
    <div style={style} className={classNames('flex flex-col', className)}>
      <div className="flex">
        <div className="w-2/5 md:w-1/5 flex-grow-0 flex-shrink-0 shadow-right z-10">
          {table([columns[0]], 'head')}
        </div>
        <FixedScrollbar className="w-3/5 md:w-4/5">
          {table(columns.slice(1), 'body')}
        </FixedScrollbar>
      </div>
      {loading && (
        <div className="flex justify-center items-center h-20">
          <LoadingIndicator />
        </div>
      )}
      {!loading && (data?.length || 0) === 0 && emptyNode}
    </div>
  );
};

export default ResponsiveTable;
