"use strict";
// TODO: Disable body scroll.
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
var react_1 = __importStar(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var XIcon_1 = __importDefault(require("@heroicons/react/outline/XIcon"));
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
        return "modal-" + counter;
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
    return react_dom_1.default.createPortal(react_1.default.createElement("div", { id: id + "-wrapper", className: (0, classnames_1.default)('fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60', !active && 'hidden') },
        react_1.default.createElement("div", { className: (0, classnames_1.default)('card relative flex flex-col', className), style: style, id: id, role: "dialog", "aria-modal": "true", "aria-labelledby": title ? id + "-label" : undefined, ref: modalRef },
            react_1.default.createElement("div", { className: "mb-4" },
                title && (react_1.default.createElement("h2", { id: id + "-label", className: "text-2xl" }, title)),
                react_1.default.createElement("button", { type: "button", className: "absolute top-4 right-4 w-6 h-6", onClick: close },
                    react_1.default.createElement(XIcon_1.default, { className: "w-full h-full" })),
                header),
            react_1.default.createElement("div", { className: "modal-content" },
                content,
                children),
            footer && react_1.default.createElement("div", { className: "modal-footer" }, footer))), modalRoot);
}
exports.default = Modal;
