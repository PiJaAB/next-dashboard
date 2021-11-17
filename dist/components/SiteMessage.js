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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var config_1 = __importDefault(require("next/config"));
var ExclamationIcon_1 = __importDefault(require("@heroicons/react/outline/ExclamationIcon"));
var ExclamationCircleIcon_1 = __importDefault(require("@heroicons/react/outline/ExclamationCircleIcon"));
var XCircleIcon_1 = __importDefault(require("@heroicons/react/outline/XCircleIcon"));
var CheckIcon_1 = __importDefault(require("@heroicons/react/outline/CheckIcon"));
var XIcon_1 = __importDefault(require("@heroicons/react/outline/XIcon"));
var classnames_1 = __importDefault(require("classnames"));
var useS_1 = __importDefault(require("../hooks/useS"));
var colors = (0, config_1.default)().publicRuntimeConfig.tailwindTheme.colors;
var borderColorMap = {
    info: colors.indigo['800'],
    error: colors.red['800'],
    warning: colors.yellow['800'],
    success: colors.green['800'],
};
var RING_SIZE = 100;
var RING_STROKE = 12;
var RING_CENTER = RING_SIZE / 2;
var RING_R = RING_CENTER - RING_STROKE;
var RING_C = 2 * RING_R * Math.PI;
function SiteMessage(_a) {
    var title = _a.title, message = _a.message, _b = _a.status, status = _b === void 0 ? 'info' : _b, timer = _a.timer, count = _a.count, dismiss = _a.dismiss;
    var timerNum = timer === true ? 5 : timer || 0;
    var s = (0, useS_1.default)();
    var label = title == null ? s(status) : title;
    var dismissRef = (0, react_1.useRef)(dismiss);
    (0, react_1.useEffect)(function () {
        dismissRef.current = dismiss;
    }, [dismiss]);
    var _c = __read((0, react_1.useState)(false), 2), isHovering = _c[0], setIsHovering = _c[1];
    var _d = __read((0, react_1.useState)(null), 2), animateEl = _d[0], setAnimateEl = _d[1];
    (0, react_1.useEffect)(function () {
        if (animateEl == null)
            return undefined;
        var el = animateEl;
        el.beginElement();
        function endListener() {
            if (dismissRef.current)
                dismissRef.current();
        }
        function beginListener() {
            el.removeEventListener('beginEvent', beginListener);
            el.addEventListener('endEvent', endListener, { passive: true });
        }
        el.addEventListener('beginEvent', beginListener, { passive: true });
        return function () {
            el.removeEventListener('endEvent', endListener);
            el.removeEventListener('beginEvent', beginListener);
        };
    }, [animateEl, count]);
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)('p-2 rounded-lg shadow-lg sm:p-3', status === 'info' && 'bg-indigo-600', status === 'error' && 'bg-red-600', status === 'warning' && 'bg-yellow-600', status === 'success' && 'bg-green-600'), onMouseEnter: function () { return setIsHovering(true); }, onMouseLeave: function () { return setIsHovering(false); } },
        react_1.default.createElement("div", { className: "flex items-center justify-between flex-wrap" },
            react_1.default.createElement("div", { className: "flex-1 flex items-center" },
                react_1.default.createElement("span", { className: (0, classnames_1.default)('flex p-2 rounded-lg', status === 'info' && 'bg-indigo-800', status === 'error' && 'bg-red-800', status === 'warning' && 'bg-yellow-800', status === 'success' && 'bg-green-800') },
                    status === 'info' && (react_1.default.createElement(ExclamationCircleIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })),
                    status === 'warning' && (react_1.default.createElement(ExclamationIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })),
                    status === 'success' && (react_1.default.createElement(CheckIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })),
                    status === 'error' && (react_1.default.createElement(XCircleIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" }))),
                react_1.default.createElement("p", { className: "ms-3 font-medium text-white" }, label ? label + ": " + message : message)),
            count != null && count > 1 && (react_1.default.createElement("div", { className: "order-3 mt-2 flex-shrink-0 flex-grow-1 w-full sm:order-2 sm:mt-0 sm:w-auto" },
                react_1.default.createElement("span", { className: (0, classnames_1.default)('flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-mediu bg-white select-none', status === 'info' && 'text-indigo-600', status === 'error' && 'text-red-600', status === 'warning' && 'text-yellow-600', status === 'success' && 'text-green-600') },
                    "x",
                    count))),
            dismiss && (react_1.default.createElement("div", { className: "order-2 flex-shrink-0 sm:order-3 sm:ms-2" },
                react_1.default.createElement("button", { type: "button", className: (0, classnames_1.default)('-me-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white relative', status === 'info' && 'hover:bg-indigo-500', status === 'error' && 'hover:bg-red-500', status === 'warning' && 'hover:bg-yellow-500', status === 'success' && 'hover:bg-green-500'), onClick: dismiss },
                    react_1.default.createElement("span", { className: "sr-only" }, s('dismiss')),
                    timerNum > 0 && !isHovering && (react_1.default.createElement("svg", { viewBox: "0 0 " + RING_SIZE + " " + RING_SIZE, xmlSpace: "preserve", className: "absolute w-7 h-7 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" },
                        react_1.default.createElement("circle", { fill: "none", stroke: borderColorMap[status], strokeWidth: RING_STROKE, cx: RING_CENTER, cy: RING_CENTER, r: RING_R, strokeDasharray: RING_C, strokeDashoffset: RING_C, strokeLinecap: "round", transform: "rotate(-90) translate(-" + RING_SIZE + " 0)" },
                            react_1.default.createElement("animate", { ref: setAnimateEl, attributeName: "stroke-dashoffset", values: RING_C + ";0", dur: timerNum, begin: "indefinite", fill: "freeze" })))),
                    react_1.default.createElement(XIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })))))));
}
exports.default = SiteMessage;
