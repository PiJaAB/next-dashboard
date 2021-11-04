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
var classnames_1 = __importDefault(require("classnames"));
var react_1 = __importStar(require("react"));
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
        style.top = -top + "px";
    }
    else {
        var style = el.style;
        style.top = "0";
    }
};
var TableHead = function (_a) {
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
    return (react_1.default.createElement("thead", { ref: headRef },
        react_1.default.createElement("tr", null, cols.map(function (column) {
            return (react_1.default.createElement("th", { key: columnKeyExtractor(column), className: (0, classnames_1.default)(column.textAlign === 'center' && 'text-center', column.textAlign === 'left' && 'text-start', column.textAlign === 'right' && 'text-end', column.textAlign === 'justify' && 'text-justify', type === 'head' &&
                    'overflow-hidden overflow-ellipsis whitespace-nowrap'), onClick: onColumnClick && (function () { return onColumnClick(column); }) }, (column.renderHead || renderHead)(column)));
        }))));
};
exports.default = TableHead;
