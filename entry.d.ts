/// <reference path="react.d.ts" />

declare module '@pija-ab/next-dashboard' {
  interface ColData<E, C> extends C {
    readonly key?: string;
    readonly title: string;
    readonly field: $Keys<E>;
  }

  interface TableColumn<E, C> extends ColData<E, C> {
    readonly renderHead?: (
      column: ColData<E, C>,
    ) => React.ReactNode | null | undefined;
    readonly renderBody?: (
      entry: E,
      column: ColData<E, C>,
    ) => React.ReactNode | null | undefined;
    readonly textAlign?: string;
  }

  interface ChartPlot {
    name: string;
    fill: string;
    stroke: string;
    value: ?number;
    key?: string;
  }

  interface HeadColumn<E, C> extends ColData<E, C> {
    readonly renderHead?: (column: HeadColumn<E, C>) => React.ReactNode;
    readonly textAlign?: string;
  }

  interface SuccessData<T = unknown> {
    readonly status: 'success';
    readonly value: T;
    readonly updating?: boolean;
  }

  interface ErrorData {
    readonly status: 'error';
    readonly error: Error;
    readonly value: never;
    readonly updating?: boolean;
  }

  interface LoadingData {
    readonly status: 'loading';
    readonly error: never;
    readonly value: never;
  }

  type DataType<T = unknown> = SuccessData<T> | ErrorData | LoadingData;

  const FORM_ALL_VALID: unique symbol;

  interface FormCTX {
    submit(): void;
    register(
      id: string,
      element: {
        validate(any): boolean | void;
        getValue<T>(): T;
      },
    ): void;
    unregister(id: string): void;
    validate<T>(id: string, val: T): boolean | void;
    validateAll(): Partial<Record<string, boolean>> & {
      [typeof FORM_ALL_VALID]: boolean;
    };
    valid: Partial<Record<string, boolean>>;
  }

  interface ResponsiveTableProps<E, C> {
    className?: string;
    columns: readonly TableColumn<E, C>[];
    data?: readonly E[] | null;
    renderHead?: (column: ColData<E, C>) => React.Node | null | undefined;
    renderBody?: (
      entry: E,
      column: ColData<E, C>,
    ) => React.ReactNode | null | undefined;
    columnKeyExtractor?: (column: ColData<E, C>) => string;
    dataKeyExtractor?: (entry: E) => string;
    onColumnClick?: (column: HeadColumn<E, C>) => void;
    style?: React.CSSProperties | null;
    rowHeight?: string | number;
    loading?: boolean;
  }

  type SortableTableCompare<E> = (
    entryA: E,
    entryB: E,
    field: string,
    directyon: 'asc' | 'desc',
  ) => number;
  type SortableTableCompareBy<E> = (
    entry: E,
    field: string,
    direction: 'asc' | 'desc',
  ) => string | number;

  interface SortableTableProps<E, C>
    extends ResponsiveTableProps<E, C> {
    compare?: SortableTableCompare<E>;
    compareBy?: SortableTableCompareBy<E>;
    title?: string;
  }

  interface SiteMessageType {
    readonly title?: string;
    readonly message: string;
    readonly status?: 'info' | 'warning' | 'error';
    readonly count?: number;
  }

  interface SiteMessageProps extends SiteMessageType {
    dismiss?: () => void;
  }

  type Statuses = 'loading' | 'success' | 'error';

  type StyledText =
    | string
    | {
        str: string;
        size:
          | number
          | ((width: number, height: number, radius: number) => number);
      };

  const Content: React.FunctionComponent<{
    contentContainerWidth?:
      | 'extra-narrow'
      | 'narrow'
      | 'normal'
      | 'wide'
      | 'extra-wide';
    header?: React.ReactNode;
  }>;
  const Footer: React.VoidFunctionComponent;
  const Header: React.FunctionComponent<{
    toggleSidebarActive: () => void;
    sidebarActive: boolean;
  }>;
  const DashboardLayout: React.FunctionComponent<{
    id?: string;
    contentContainerWidth?:
      | 'extra-narrow'
      | 'narrow'
      | 'normal'
      | 'wide'
      | 'extra-wide';
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    footer?: boolean;
  }>;
  const Sidebar: React.FunctionComponent<{
    sidebarActive: boolean;
    sidebarCompact: boolean;
  }>;
  const SiteMessages: React.VoidFunctionComponent;

  function PieChart<T extends ChartPlot>(
    props: React.PropsWithChildren<{
      plots: readonly T[];
      offsetAngle?: number;
      angularSize?: number;
      valueFormatter?: (
        num: number,
        plot: T,
        isTooltip: boolean,
      ) => string | number | null | undefined;
    }>,
  ): JSX.Element;
  function HollowPieChart<T extends ChartPlot>(
    props: React.PropsWithChildren<{
      plots: readonly T[];
      offsetAngle?: number;
      angularSize?: number;
      valueFormatter?: (
        num: number,
        plot: T,
        isTooltip: boolean,
      ) => string | number | null | undefined;
      centerText?: StyledText | [StyledText, StyledText];
    }>,
  ): JSX.Element;
  function RadialBarChart<T extends ChartPlot>(
    props: React.PropsWithChildren<{
      plots: readonly T[];
      maxValue?: number;
      offsetAngle?: number;
      angularSize?: number;
      valueFormatter?: (
        num: number,
        plot: T,
        isTooltip: boolean,
      ) => string | number | null | undefined;
      centerText?: StyledText | [StyledText, StyledText];
    }>,
  ): JSX.Element;
  function BarsChart<T extends ChartPlot>(
    props: React.PropsWithChildren<{
      plots: readonly T[];
      valueFormatter?: (
        num: number,
        plot: T,
        isTooltip: boolean,
      ) => string | number | null | undefined;
      maxBarSize?: number;
      maxGapSize?: number;
      gapSize?: number;
      barSize?: number;
      legend?: boolean;
      valign?: 'left' | 'center' | 'right';
      pageChart?: boolean;
    }>,
  ): JSX.Element;

  const PageChart: React.FunctionComponent;
  const LineChart: React.FunctionComponent;
  const StackedVerticalBarChart: React.VoidFunctionComponent<{
    title: string;
    data: readonly {
      readonly Period: string;
      readonly Average: number;
    }[];
    chartLineColor: string;
    loading?: boolean;
  }>;
  const Chart: React.VoidFunctionComponent<{
    title: string;
    data: readonly {
      readonly [key: string]: unknown;
    }[];
    chartLineColor: string;
    loading?: boolean;
    xAxisKey?: string | null;
    areaChartKey?: string | null;
    barChartKeysAndColor?:
      | null
      | { key: string; color: string }
      | { key: string; color: string; stackId?: string }[];
  }>;
  const WrapChart: React.VoidFunctionComponent<{
    children: (number, number) => React.ReactNode;
    height?: number;
    width?: number;
    hoffset?: number;
    voffset?: number;
  }>;

  const FullscreenButton: React.VoidFunctionComponent<{
    className?: string;
  }>;
  const RightSidebar: React.FunctionComponent<{
    icon?: string;
    isOpen?: boolean;
    onChange?: (value: boolean) => void;
    initialIsOpen?: boolean;
    className?: string;
  }>;
  function SortableTable<
    E extends {} = { readonly [key: string]: unknown },
    C extends {} = {}
  >(props: SortableTableProps<E, C>): JSX.Element;
  function SortablePageTable<E extends {}, C extends {}>(
    props: SortableTableProps<E, C>,
  ): JSX.Element;
  const HeaderCell: React.FunctionComponent<{
    className?: string;
    type?: string;
    separator?: boolean;
    fullscreenButton?: boolean;
  }>;
  const Statistic: React.VoidFunctionComponent<{
    label?: React.ReactNode;
    value?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    periodValue?: React.ReactNode;
    periodText?: React.ReactNode;
    description?: React.ReactNode;
    status?: Statuses;
    direction?: 'up' | 'down';
    positive?: 'up' | 'down' | null;
    className?: string;
  }>;
  const PageContent: React.FunctionComponent<
    React.HTMLAttributes<HTMLDivElement>
  >;
  const LoadingIndicator: React.VoidFunctionComponent<{
    backgroundColor?: string;
    extraStyles?: React.CSSProperties;
  }>;
  const Modal: React.FunctionComponent<{
    id: string;
    active: boolean;
    close: () => void;
    status?: string;
    width?: 'extra-narrow' | 'narrow' | 'normal' | 'wide' | 'extra-wide';
    title?: string;
    header?: React.ReactNode;
    content?: React.ReactNode;
    footer?: React.ReactNode;
  }>;
  const NavEntry: React.FunctionComponent<{
    href?: string;
    as?: string;
    icon?: React.ReactNode;
    onClick?: (ev: MouseEvent) => boolean | null | undefined;
    active?: boolean;
  }>;
  const NavSection: React.FunctionComponent<{
    id?: string;
  }>;
  const NavSeparator: React.FunctionComponent;
  const CompactButton: React.FunctionComponent<{
    icon?: React.ReactNode;
  }>;
  const ThemeSelector: React.FunctionComponent<{
    icon?: React.ReactNode;
  }>;
  function PageTable<E extends {}, C>(
    props: ResponsiveTableProps<E, C>,
  ): JSX.Element;
  function ResponsiveTable<E extends {}, C>(
    props: ResponsiveTableProps<E, C>,
  ): JSX.Element;
  const SiteMessage: React.VoidFunctionComponent<SiteMessageProps>;
  const FixedScrollbar: React.FunctionComponent<
    React.HTMLAttributes<HTMLDivElement>
  >;
  const VerticalBarChart: React.VoidFunctionComponent<{
    title: string;
    data: readonly {
      readonly Fullname: string;
      readonly loggedtime: number;
      readonly utilization: number;
    }[];
    loading?: boolean;
    barChartKeysAndColor?:
      | null
      | { key: string; color: string }
      | { key: string; color: string; stackId?: string }[];
  }>;
  const FeatureBox: React.VoidFunctionComponent<{
    icon?: string;
    iconBackgroundColor?: string;
    label?: React.ReactNode;
    value: string | number | void;
    footerComponent?: React.ReactNode;
    status?: Statuses;
    extraStyles?: React.CSSProperties;
    contentFontSize?: number | string;
  }>;
  const DropdownView: React.FunctionComponent<{
    classPrefix?: string;
    isDisabled?: boolean;
    label: string;
    titleColor?: string;
    dropdownExtraClasses?: string;
  }>;
  function Fader<El extends keyof HTMLElementTagNameMap>(
    props: React.HTMLAttributes<HTMLElementTagNameMap[El]> &
      React.PropsWithChildren<{
        data?: DataType | readonly DataType[];
        updating?: boolean;
        as?: El;
        className?: string;
      }>,
  ): JSX.Element;
  const FormContext: React.Context<FormCTX>;
  const Form: React.PureComponent<
    React.PropsWithChildren<{}>,
    {
      ctx: Omit<FormCTX, 'valid'>;
      valid: FormCTX['valid'];
    }
  >;
  function FormElement<T, U = T>(props: {
    children: (
      value: T,
      onChange: (val: T) => void,
      isValid: boolean | void,
    ) => React.Node;
    valueParser?: (raw: T) => U;
    validate(val: T): boolean | void;
    initialValue: T;
    id: string;
  }): JSX.Element;
}
