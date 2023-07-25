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
var jsx_runtime_1 = require("react/jsx-runtime");
var classnames_1 = __importDefault(require("classnames"));
var react_1 = require("react");
var hooks_1 = require("../hooks");
var utils_1 = require("../utils");
var HEADER_OFFSET = 70; // Header is 70px tall
var update = function (el, hasHeader) {
    var rect = el.getClientRects()[0];
    if (!rect)
        return;
    var top = rect.top - (hasHeader ? HEADER_OFFSET : 0);
    if (top < 0) {
        var style = el.style;
        style.top = "".concat(-top, "px");
    }
    else {
        var style = el.style;
        style.top = "0";
    }
};
function TableHead(_a) {
    var cols = _a.cols, columnKeyExtractor = _a.columnKeyExtractor, renderHead = _a.renderHead, onColumnClick = _a.onColumnClick, _b = _a.type, type = _b === void 0 ? 'body' : _b;
    var headRef = (0, react_1.useRef)(null);
    var ctx = (0, react_1.useContext)(utils_1.LayoutContext);
    var hasHeader = ctx.getTemp('hasHeader', true);
    (0, react_1.useEffect)(function () {
        var headEl = headRef.current;
        if (!headEl)
            return undefined;
        var onscroll = function () { return update(headEl, hasHeader); };
        onscroll();
        window.addEventListener('scroll', onscroll);
        window.addEventListener('resize', onscroll);
        return function () {
            window.removeEventListener('scroll', onscroll);
            window.removeEventListener('resize', onscroll);
        };
    }, [hasHeader, headRef]);
    var mutationCallback = (0, react_1.useCallback)(function () {
        var headEl = headRef.current;
        if (!headEl)
            return;
        update(headEl, hasHeader);
    }, [hasHeader]);
    (0, hooks_1.useMutationObserver)(typeof window !== 'undefined' ? window.document.documentElement : undefined, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
    }, mutationCallback);
    return ((0, jsx_runtime_1.jsx)("thead", __assign({ ref: headRef }, { children: (0, jsx_runtime_1.jsx)("tr", { children: cols.map(function (column) {
                return ((0, jsx_runtime_1.jsx)("th", __assign({ className: (0, classnames_1.default)(column.textAlign === 'center' && 'text-center', column.textAlign === 'left' && 'text-start', column.textAlign === 'right' && 'text-end', column.textAlign === 'justify' && 'text-justify', type === 'head' &&
                        'overflow-hidden overflow-ellipsis whitespace-nowrap'), onClick: onColumnClick && (function () { return onColumnClick(column); }) }, { children: (column.renderHead || renderHead)(column) }), columnKeyExtractor(column)));
            }) }) })));
}
exports.default = TableHead;
