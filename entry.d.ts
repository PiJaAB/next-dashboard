/// <reference path="react.d.ts" />
/// <reference types="next" />

declare module '@pija-ab/next-dashboard' {
  import {
    GetInitialPropsContext,
    NextComponentType,
    NextPageContext,
  } from 'next';

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

  class NotImplementedError extends Error {
    constructor(message?: string);
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

  interface Branding {
    /** Site name */
    name: string;
    /** Array of keywords globally relevant for the site */
    keywords?: string[];
    /** URL to the homepage/index, used e.g. for the logo */
    homepageURL?: string;
    /** Base URL for location of logo images, or map from theme class name to logo URL */
    logoURL?: string | { [string]: string };
  }

  interface Theme {
    name: string;
    class: string;
  }

  interface SiteMessageType {
    readonly title?: string;
    readonly message: string;
    readonly status?: 'info' | 'warning' | 'error';
    readonly count?: number;
  }

  type Statuses = 'loading' | 'success' | 'error';

  interface DataProps<P extends { status?: Statuses }>
    extends Omit<P, 'status'> {
    status: Statuses;
  }

  type DataExtra =
    | Partial<{
        readonly [key: string]: DataExtra;
      }>
    | readonly DataExtra[]
    | number
    | string
    | boolean
    | null;

  type PollingFetcher<Data extends {}> = {
    readonly runner:
      | keyof Data
      | readonly (keyof Data)[]
      | ((extra?: DataExtra) => Promise<unknown> | unknown);
    readonly parser?: (...args: any[]) => any;
    readonly interval?: number | ((extra?: DataExtra) => number | void);
    readonly id: keyof Data;
  };

  type PathFragment = string | number | (string | number)[];

  type DataPath = Readonly<Record<string, PathFragment>> | PathFragment;

  abstract class AbstractAuthProvider {
    constructor(ctx: GetInitialPropsContext | string): void;
    serialize(): string;
    isAuthorizedForRoute(
      href: string,
      asPath: string,
      query: Partial<Record<string, string>>,
    ): boolean | Symbol | Promise<boolean | Symbol>;
    isAuthenticated(): boolean;
    readonly ready?: Promise<unknown> | unknown;
  }

  type DashboardInitialPropsContext = NextPageContext & {
    authProvider?: AbstractAuthProvider;
  };

  type DashboardComponent<P extends {}, I extends {} = {}> = NextComponentType<
    DashboardInitialPropsContext,
    I,
    P
  >;

  interface ISubscriptionProvider<Data extends {}> {
    read<DS extends keyof Data>(
      dataSource: DS,
      extra?: DataExtra,
    ): DataType<Data[DS]>;

    subscribe<DS extends keyof Data>(
      cb: (val: DataType<Data[DS]>) => void,
      dataSource: DS,
      extra?: DataExtra,
    ): void;

    unsubscribe<DS extends keyof Data>(
      cb: (val: DataType<Data[DS]>) => void,
      dataSource: DS,
      extra?: DataExtra,
    ): void;
  }

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

  interface SortableTableProps<E, C> extends ResponsiveTableProps<E, C> {
    compare?: SortableTableCompare<E>;
    compareBy?: SortableTableCompareBy<E>;
    title?: string;
  }

  interface SiteMessageProps extends SiteMessageType {
    dismiss?: () => void;
  }

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

  type ParsedPollingFetcher<Data extends {}> = {
    readonly id: string;
    readonly interval?: number | ((extra?: DataExtra) => number | void);
    readonly runner:
      | keyof Data
      | readonly (keyof data)[]
      | ((extra?: DataExtra) => unknown);
    readonly parser?: (val: any) => any;
  };

  class SubscribtionPoller<Data extends {} = {}>
    extends EventEmitter
    implements ISubscriptionProvider<Data> {
    public readonly start?: (id: string) => void;

    public readonly stop?: (id: string) => void;

    protected activeListeners: Map<
      string,
      Set<(val: DataType<Data, keyof Data>) => void>
    >;

    protected fetchers: ParsedPollingFetcher<Data>[];

    protected activeFetchers: Map<string, ParsedPollingFetcher<Data>>;

    protected stoppingTimers: Map<string, number>;

    protected dataCache: Partial<{ [key in keyof Data]: DataType<Data[key]> }>;

    protected aliasCallbacks: Map<
      string,
      readonly [keyof Data, (val: DataType<Data[keyof Data]>) => void][]
    > = new Map();

    constructor(
      fetcher?: PollingFetcher<Data> | $ReadOnlyArray<PollingFetcher<Data>>,
    );

    async startFetcher(fetcher: ParsedPollingFetcher<Data>): void;

    addFetcher(
      fetcher: PollingFetcher<Data> | $ReadOnlyArray<PollingFetcher<Data>>,
    ): void;

    setUpdating(dataSource: string): ?DataType<> {
      if (!this.dataCache[dataSource]) return;
      // $FlowIssue: I not sure why flow spazzes out...
      const newData: DataType<> = {
        ...this.dataCache[dataSource],
        updating: true,
      };
      this.setData(dataSource, newData);
    }

    setData<DS extends keyof Data>(
      dataSource: string,
      data: DataType<Data[DS]>,
    ): void;

    getActiveListeners(): readonly string[];

    read<DS extends keyof Data>(
      dataSource: DS,
      extra?: DataExtra,
    ): DataType<Data[DS]>;

    subscribe<DS extends keyof Data>(
      cb: (data: DataType<Data[DS]>) => void,
      dataSource: DS,
      extra?: DataExtra,
    ): void;

    unsubscribe<DS extends keyof Data>(
      cb: (data: DataType<Data[DS]>) => void,
      dataSource: string,
      extra?: DataExtra,
    ): void;

    send<T>(_key: string, _data: T, _extra?: mixed): Promise<void> | void {
      throw new NotImplementedError();
    }
  }

  interface FullConfig {
    AuthProvider: AbstractAuthProvider;
    branding: Branding;
    themes: readonly Theme[];
    needAuthDefault: boolean;
    unauthedRoute?: string;
    ClientAuthComp?: React.ComponentType<any>;
    error?: {
      Component: NextComponentType;
      withContext?: boolean;
    };
  }

  interface Config extends Partial<Omit<FullConfig, 'AuthProvider'>> {
    AuthProvider: $PropertyType<FullConfig, 'AuthProvider'>;
  }

  declare const ConfigContext: React.Context<FullConfig>;

  interface IDashboardContext {
    getState: <T>(key: string, defaultValue: T) => T;
    setState: <T>(key: string, value: T) => void;

    readonly siteMessages: readonly SiteMessageType[];
    registerSiteMessage(siteMessages: Error | SiteMessageType): void;
    dismissSiteMessage(siteMessages: SiteMessageType): void;

    readonly Comp: DashboardComponent<any>;

    isAuthenticated(): boolean | Promise<boolean>;
    getAuthProvider<T extends AbstractAuthProvider>(
      Class: typeof AbstractAuthProvider,
    ): T | void;
  }

  const DashboardContext: React.Context<IDashboardContext>;

  function createDashboardHOC(): <U extends {}, Q extends {} = {}>(
    Comp: DashboardComponent<U, Q>,
    needAuth?: boolean | null,
    configOverride?: Partial<Config> | null,
  ) => NextComponentType<
    Q & {
      __ERRORED__: boolean;
      __INITIAL_DASHBOARD_STATE__: Record<string, any> | void;
      __INITIAL_LAYOUT_STATE__: Record<string, any> | void;
      __ERR_PROPS__: {} | void;
      __AUTH_SERIALIZED__: string;
      __PERFORM_SSR__: boolean | void;
    },
    U
  >;

  const CLIENT_AUTH: unique symbol;

  function createPersistentState<PersistentState>(
    cookieName: string,
    version?: number,
  ): {
    getInitialState(
      ctx: GetInitialPropsContext | string,
    ): PersistentState | null;
    persist(
      state: PersistentState,
      noDebounce?: boolean,
      ctx?: GetInitialPropsContext | string,
    ): void;
    serialize(state: PersistentState): string;
  };

  function useData<Data extends {}, DS extends keyof Data>(
    subProvider: ISubscriptionProvider<Data>,
    dataSource: DS,
    extra?: DataExtra,
    dummy?: boolean,
  ): DataType<Data[DS]>;

  function withData<
    Type,
    Data extends {},
    Props extends { value: Type; status: Statuses }
  >(
    Comp: React.ComponentType<Props>,
    subProvider: ISubscriptionProvider<Data>,
    opts: {
      defaults: {
        error: (err: Error) => Type;
        loading: () => Type;
      };
    },
  ): <DS extends keyof Data>(
    props: Omit<Props, 'status'> & {
      parser: (data: DataType<Data[DS]>) => T;
      dataSource: DS;
      extra?: DataExtra;
    },
  ) => JSX.Element;

  class SilentError extends Error {
    constructor(error?: Error | string | null);
  }

  function makeSilent(error: Error): never;

  class ConsoleError extends SilentError {
    constructor(error?: Error | string | null);
  }

  function makeConsole(error: Error): never;

  const errorReporter: {
    report(err: Error): Promise<boolean>;
  };

  function useMutationObserver(
    target: Node,
    options: MutationObserverInit | void | null,
    callback?: Callback | null,
  ): void;

  function confirmDialogue(opts: {
    ok: () => void;
    renderOk?: React.ReactNode | ((confirm: () => void) => React.ReactNode);
    cancel?: () => void;
    renderCancel?: React.ReactNode | ((cancel: () => void) => React.ReactNode);
    title?: string;
    message?: React.ReactNode;
  }): () => void;
}
