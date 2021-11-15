"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRenderHead = void 0;
var react_1 = __importStar(require("react"));
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
    return react_1.default.createElement("tr", null, children);
};
var defaultRenderCell = function (_a) {
    var children = _a.children, dataTip = _a.dataTip, dataHtml = _a.dataHtml, className = _a.className;
    return (react_1.default.createElement("td", { "data-tip": dataTip, "data-html": dataHtml, className: className }, children));
};
var ResponsiveTable = function (_a) {
    var className = _a.className, columns = _a.columns, data = _a.data, _b = _a.renderHead, renderHead = _b === void 0 ? exports.defaultRenderHead : _b, _c = _a.renderBody, renderBody = _c === void 0 ? defaultRenderBody : _c, _d = _a.columnKeyExtractor, columnKeyExtractor = _d === void 0 ? defaultColumnKeyExtractor : _d, _e = _a.dataKeyExtractor, dataKeyExtractor = _e === void 0 ? defaultKeyExtractor : _e, onColumnClick = _a.onColumnClick, style = _a.style, rowHeight = _a.rowHeight, _f = _a.htmlTooltip, htmlTooltip = _f === void 0 ? false : _f, loading = _a.loading, _g = _a.renderRow, RenderRow = _g === void 0 ? defaultRenderRow : _g, _h = _a.renderCell, renderCell = _h === void 0 ? defaultRenderCell : _h, emptyNode = _a.emptyNode;
    var rebuildTooltip = (0, useRebuildTooltip_1.default)();
    (0, react_1.useEffect)(function () {
        rebuildTooltip();
    }, [data, rebuildTooltip]);
    var table = function (cols, type) { return (react_1.default.createElement("table", { className: (0, classnames_1.default)(type === 'head' && 'table-fixed', 'w-full') },
        react_1.default.createElement(ResponsiveTableHead_1.default, { cols: cols, columnKeyExtractor: columnKeyExtractor, renderHead: renderHead, onColumnClick: onColumnClick, type: type }),
        react_1.default.createElement("tbody", { style: {
                lineHeight: typeof rowHeight === 'number' ? rowHeight + "px" : rowHeight,
            }, className: "divide-y divide-gray-500" }, data &&
            data.map(function (entry) { return (react_1.default.createElement(RenderRow, { row: entry, isLabel: type === 'head', key: dataKeyExtractor(entry) }, cols.map(function (column) {
                var RenderCell = column.renderCell || renderCell;
                return (react_1.default.createElement(RenderCell, { row: entry, column: column, isLabel: type === 'head', dataTip: (column.useTooltip == null
                        ? type === 'head'
                        : column.useTooltip)
                        ? (column.renderBody || renderBody)(entry, column, true)
                        : null, dataHtml: column.htmlTooltip != null
                        ? column.htmlTooltip
                        : htmlTooltip, key: columnKeyExtractor(column), className: (0, classnames_1.default)(column.textAlign === 'center' && 'text-center', column.textAlign === 'left' && 'text-start', column.textAlign === 'right' && 'text-end', column.textAlign === 'justify' && 'text-justify', type === 'head' &&
                        'overflow-hidden overflow-ellipsis whitespace-nowrap') }, (column.renderBody || renderBody)(entry, column, false)));
            }))); })))); };
    return (react_1.default.createElement("div", { style: style, className: (0, classnames_1.default)('flex flex-col', className) },
        react_1.default.createElement("div", { className: "flex" },
            react_1.default.createElement("div", { className: "w-2/5 md:w-1/5 flex-grow-0 flex-shrink-0 shadow-end z-10" }, table([columns[0]], 'head')),
            react_1.default.createElement(FixedScrollbar_1.default, { className: "w-3/5 md:w-4/5" }, table(columns.slice(1), 'body'))),
        loading && (react_1.default.createElement("div", { className: "flex justify-center items-center h-20" },
            react_1.default.createElement(LoadingIndicator_1.default, null))),
        !loading && ((data === null || data === void 0 ? void 0 : data.length) || 0) === 0 && emptyNode));
};
exports.default = ResponsiveTable;
