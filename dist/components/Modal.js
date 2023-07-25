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
// TODO: Disable body scroll.
var react_1 = require("react");
var react_dom_1 = __importDefault(require("react-dom"));
var XMarkIcon_1 = __importDefault(require("@heroicons/react/24/outline/XMarkIcon"));
var classnames_1 = __importDefault(require("classnames"));
var layoutContext_1 = __importDefault(require("../utils/layoutContext"));
var useInitialRender_1 = __importDefault(require("../hooks/useInitialRender"));
var counter = 0;
function Modal(_a) {
    var providedId = _a.id, active = _a.active, close = _a.close, title = _a.title, header = _a.header, content = _a.content, children = _a.children, footer = _a.footer, className = _a.className, style = _a.style;
    var context = (0, react_1.useContext)(layoutContext_1.default);
    var initial = (0, useInitialRender_1.default)();
    var modalRef = (0, react_1.useRef)(null);
    var id = (0, react_1.useMemo)(function () {
        if (providedId)
            return providedId;
        counter += 1;
        return "modal-".concat(counter);
    }, [providedId]);
    var click = (0, react_1.useCallback)(function (event) {
        var modalRefEle = modalRef.current;
        if (!(modalRefEle &&
            event.target instanceof Node &&
            modalRefEle.contains(event.target)))
            close();
    }, [close]);
    var escape = (0, react_1.useCallback)(function (event) {
        if (event.key === 'Escape')
            close();
    }, [close]);
    (0, react_1.useEffect)(function () {
        context.setModalActive(active);
        if (!active)
            return undefined;
        document.addEventListener('mousedown', click);
        document.addEventListener('keydown', escape);
        return function () {
            document.removeEventListener('mousedown', click);
            document.removeEventListener('keydown', escape);
        };
    }, [active, click, close, context, escape]);
    if (typeof window === 'undefined')
        return null;
    var modalRoot = document.getElementById('dashboard-modal-root');
    if (!modalRoot)
        return null;
    if (initial)
        return null;
    return react_dom_1.default.createPortal((0, jsx_runtime_1.jsx)("div", __assign({ id: "".concat(id, "-wrapper"), className: (0, classnames_1.default)('fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60', !active && 'hidden') }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, classnames_1.default)('card relative flex flex-col', className), style: style, id: id, role: "dialog", "aria-modal": "true", "aria-labelledby": title ? "".concat(id, "-label") : undefined, ref: modalRef }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "mb-4" }, { children: [title && ((0, jsx_runtime_1.jsx)("h2", __assign({ id: "".concat(id, "-label"), className: "text-2xl" }, { children: title }))), (0, jsx_runtime_1.jsx)("button", __assign({ type: "button", className: "absolute top-4 right-4 w-6 h-6", onClick: close }, { children: (0, jsx_runtime_1.jsx)(XMarkIcon_1.default, { className: "w-full h-full" }) })), header] })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "modal-content" }, { children: [content, children] })), footer && (0, jsx_runtime_1.jsx)("div", __assign({ className: "modal-footer" }, { children: footer }))] })) })), modalRoot);
}
exports.default = Modal;
