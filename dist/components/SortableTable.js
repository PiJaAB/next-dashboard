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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var ResponsiveTable_1 = __importStar(require("./ResponsiveTable"));
function getDefaultCompare(compareBy) {
    return function (a, b, field, dir) {
        var av = compareBy(a, field, dir);
        var bv = compareBy(b, field, dir);
        // Make string comparisons locale-sensitive by default
        if (typeof av === 'string' || typeof bv === 'string') {
            return String(av).localeCompare(String(bv));
        }
        // Fall back to generic `<` comparison
        if (av < bv)
            return -1;
        if (av > bv)
            return +1;
        return 0;
    };
}
var defaultCompareBy = function (entry, field) { return entry[field]; };
function SortIcon(_a) {
    var col = _a.col, sort = _a.sort;
    return (react_1.default.createElement("span", { className: (0, classnames_1.default)('fa', "fa-sort" + (sort && sort.field === col.field
            ? "-" + (sort.dir === 'asc' ? 'up' : 'down')
            : ''), (!sort || sort.field !== col.field) && 'hidden') }));
}
var SortableTable = function (_a) {
    var orgData = _a.data, onColumnClick = _a.onColumnClick, compare = _a.compare, compareBy = _a.compareBy, renderHead = _a.renderHead, className = _a.className, title = _a.title, props = __rest(_a, ["data", "onColumnClick", "compare", "compareBy", "renderHead", "className", "title"]);
    var _b = __read((0, react_1.useState)(orgData), 2), data = _b[0], setData = _b[1];
    var _c = __read((0, react_1.useState)(), 2), sort = _c[0], setSort = _c[1];
    (0, react_1.useEffect)(function () {
        setData(function (oldData) {
            if (oldData === orgData && !sort)
                return oldData;
            if (!sort || !orgData) {
                return orgData;
            }
            var comparator = compare || getDefaultCompare(compareBy || defaultCompareBy);
            return __spreadArray([], __read(orgData), false).sort(function (a, b) {
                var comp = comparator(a, b, sort.field, sort.dir);
                return sort.dir === 'asc' ? comp : -comp;
            });
        });
    }, [sort, orgData, compare, compareBy]);
    var handleColumnClick = (0, react_1.useCallback)(function (col) {
        if (onColumnClick)
            onColumnClick(col);
        if (!sort || sort.field !== col.field) {
            setSort({
                field: col.field,
                dir: 'desc',
            });
        }
        else if (sort.dir === 'asc') {
            setSort(undefined);
        }
        else {
            setSort(__assign(__assign({}, sort), { dir: 'asc' }));
        }
    }, [onColumnClick, sort]);
    var wrappedRenderHead = function (col) { return (react_1.default.createElement(react_1.default.Fragment, null,
        (renderHead || ResponsiveTable_1.defaultRenderHead)(col),
        ' ',
        react_1.default.createElement(SortIcon, { col: col, sort: sort }))); };
    return (react_1.default.createElement("div", null,
        title && react_1.default.createElement("h2", null, title),
        react_1.default.createElement(ResponsiveTable_1.default, __assign({ className: (0, classnames_1.default)('sortable-table', className), data: data, renderHead: wrappedRenderHead, onColumnClick: handleColumnClick }, props))));
};
exports.default = SortableTable;
