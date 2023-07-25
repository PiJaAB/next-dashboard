"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRenderHead = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var classnames_1 = __importDefault(require("classnames"));
var FixedScrollbar_1 = __importDefault(require("./FixedScrollbar"));
var ResponsiveTableHead_1 = __importDefault(require("./ResponsiveTableHead"));
var LoadingIndicator_1 = __importDefault(require("./LoadingIndicator"));
var useRebuildTooltip_1 = __importDefault(require("../hooks/useRebuildTooltip"));
var defaultRenderHead = function (_a) {
    var title = _a.title;
    return title;
};
exports.defaultRenderHead = defaultRenderHead;
var defaultRenderBody = function (entry, _a) {
    var field = _a.field;
    return entry[field] !== null ? String(entry[field]) : null;
};
var defaultKeyExtractor = function (_a) {
    var key = _a.key;
    return key;
};
var defaultColumnKeyExtractor = function (_a) {
    var field = _a.field, key = _a.key;
    return key || field;
};
var defaultRenderRow = function (_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)("tr", { children: children });
};
var defaultRenderCell = function (_a) {
    var children = _a.children, dataTip = _a.dataTip, dataHtml = _a.dataHtml, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("td", __assign({ "data-tip": dataTip, "data-html": dataHtml, className: className }, { children: children })));
};
function ResponsiveTable(_a) {
    var className = _a.className, columns = _a.columns, data = _a.data, _b = _a.renderHead, renderHead = _b === void 0 ? exports.defaultRenderHead : _b, _c = _a.renderBody, renderBody = _c === void 0 ? defaultRenderBody : _c, _d = _a.columnKeyExtractor, columnKeyExtractor = _d === void 0 ? defaultColumnKeyExtractor : _d, _e = _a.dataKeyExtractor, dataKeyExtractor = _e === void 0 ? defaultKeyExtractor : _e, onColumnClick = _a.onColumnClick, style = _a.style, rowHeight = _a.rowHeight, _f = _a.htmlTooltip, htmlTooltip = _f === void 0 ? false : _f, loading = _a.loading, _g = _a.renderRow, RenderRow = _g === void 0 ? defaultRenderRow : _g, _h = _a.renderCell, renderCell = _h === void 0 ? defaultRenderCell : _h, emptyNode = _a.emptyNode;
    var rebuildTooltip = (0, useRebuildTooltip_1.default)();
    (0, react_1.useEffect)(function () {
        rebuildTooltip();
    }, [data, rebuildTooltip]);
    var table = function (cols, type) { return ((0, jsx_runtime_1.jsxs)("table", __assign({ className: (0, classnames_1.default)(type === 'head' && 'table-fixed', 'w-full') }, { children: [(0, jsx_runtime_1.jsx)(ResponsiveTableHead_1.default, { cols: cols, columnKeyExtractor: columnKeyExtractor, renderHead: renderHead, onColumnClick: onColumnClick, type: type }), (0, jsx_runtime_1.jsx)("tbody", __assign({ style: {
                    lineHeight: typeof rowHeight === 'number' ? "".concat(rowHeight, "px") : rowHeight,
                }, className: "divide-y divide-gray-500" }, { children: data &&
                    data.map(function (entry) { return ((0, jsx_runtime_1.jsx)(RenderRow, __assign({ row: entry, isLabel: type === 'head' }, { children: cols.map(function (column) {
                            var RenderCell = column.renderCell || renderCell;
                            return ((0, jsx_runtime_1.jsx)(RenderCell, __assign({ row: entry, column: column, isLabel: type === 'head', dataTip: (column.useTooltip == null
                                    ? type === 'head'
                                    : column.useTooltip)
                                    ? (column.renderBody || renderBody)(entry, column, true)
                                    : null, dataHtml: column.htmlTooltip != null
                                    ? column.htmlTooltip
                                    : htmlTooltip, className: (0, classnames_1.default)(column.textAlign === 'center' && 'text-center', column.textAlign === 'left' && 'text-start', column.textAlign === 'right' && 'text-end', column.textAlign === 'justify' && 'text-justify', type === 'head' &&
                                    'overflow-hidden overflow-ellipsis whitespace-nowrap') }, { children: (column.renderBody || renderBody)(entry, column, false) }), columnKeyExtractor(column)));
                        }) }), dataKeyExtractor(entry))); }) }))] }))); };
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ style: style, className: (0, classnames_1.default)('flex flex-col', className) }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "w-2/5 md:w-1/5 flex-grow-0 flex-shrink-0 shadow-end z-10" }, { children: table([columns[0]], 'head') })), (0, jsx_runtime_1.jsx)(FixedScrollbar_1.default, __assign({ className: "w-3/5 md:w-4/5" }, { children: table(columns.slice(1), 'body') }))] })), loading && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "flex justify-center items-center h-20" }, { children: (0, jsx_runtime_1.jsx)(LoadingIndicator_1.default, {}) }))), !loading && ((data === null || data === void 0 ? void 0 : data.length) || 0) === 0 && emptyNode] })));
}
exports.default = ResponsiveTable;
