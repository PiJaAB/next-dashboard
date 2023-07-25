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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var ExclamationTriangleIcon_1 = __importDefault(require("@heroicons/react/24/outline/ExclamationTriangleIcon"));
var ExclamationCircleIcon_1 = __importDefault(require("@heroicons/react/24/outline/ExclamationCircleIcon"));
var XCircleIcon_1 = __importDefault(require("@heroicons/react/24/outline/XCircleIcon"));
var CheckIcon_1 = __importDefault(require("@heroicons/react/24/outline/CheckIcon"));
var XMarkIcon_1 = __importDefault(require("@heroicons/react/24/outline/XMarkIcon"));
var classnames_1 = __importDefault(require("classnames"));
var useS_1 = __importDefault(require("../hooks/useS"));
var RING_SIZE = 100;
var RING_STROKE = 12;
var RING_CENTER = RING_SIZE / 2;
var RING_R = RING_CENTER - RING_STROKE;
var RING_C = 2 * RING_R * Math.PI;
function StatusCircle(_a) {
    var className = _a.className, timer = _a.timer, animateRef = _a.animateRef;
    return ((0, jsx_runtime_1.jsx)("circle", __assign({ fill: "none", className: className, strokeWidth: RING_STROKE, cx: RING_CENTER, cy: RING_CENTER, r: RING_R, strokeDasharray: RING_C, strokeDashoffset: RING_C, strokeLinecap: "round", transform: "rotate(-90) translate(-".concat(RING_SIZE, " 0)") }, { children: (0, jsx_runtime_1.jsx)("animate", { ref: animateRef, attributeName: "stroke-dashoffset", values: "".concat(RING_C, ";0"), dur: timer, begin: "indefinite", fill: "freeze" }) })));
}
function StatusCircleSvg(_a) {
    var status = _a.status, dismiss = _a.dismiss, timer = _a.timer, count = _a.count;
    var dismissRef = (0, react_1.useRef)(dismiss);
    (0, react_1.useEffect)(function () {
        dismissRef.current = dismiss;
    }, [dismiss]);
    var _b = __read((0, react_1.useState)(null), 2), animateEl = _b[0], setAnimateEl = _b[1];
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
    var circleEl = null;
    switch (status) {
        case 'info':
            circleEl = ((0, jsx_runtime_1.jsx)(StatusCircle, { className: "stroke-indigo-800", timer: timer, animateRef: setAnimateEl }));
            break;
        case 'error':
            circleEl = ((0, jsx_runtime_1.jsx)(StatusCircle, { className: "stroke-red-800", timer: timer, animateRef: setAnimateEl }));
            break;
        case 'warning':
            circleEl = ((0, jsx_runtime_1.jsx)(StatusCircle, { className: "stroke-yellow-800", timer: timer, animateRef: setAnimateEl }));
            break;
        case 'success':
            circleEl = ((0, jsx_runtime_1.jsx)(StatusCircle, { className: "stroke-green-800", timer: timer, animateRef: setAnimateEl }));
            break;
        default:
            throw new Error("Unknown status: ".concat(status));
    }
    return ((0, jsx_runtime_1.jsx)("svg", __assign({ viewBox: "0 0 ".concat(RING_SIZE, " ").concat(RING_SIZE), xmlSpace: "preserve", className: "absolute w-7 h-7 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" }, { children: circleEl })));
}
function SiteMessage(_a) {
    var title = _a.title, message = _a.message, _b = _a.status, status = _b === void 0 ? 'info' : _b, timer = _a.timer, count = _a.count, dismiss = _a.dismiss;
    var timerNum = timer === true ? 5 : timer || 0;
    var s = (0, useS_1.default)();
    var label = title == null ? s(status) : title;
    var _c = __read((0, react_1.useState)(false), 2), isHovering = _c[0], setIsHovering = _c[1];
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classnames_1.default)('p-2 rounded-lg shadow-lg sm:p-3', status === 'info' && 'bg-indigo-600', status === 'error' && 'bg-red-600', status === 'warning' && 'bg-yellow-600', status === 'success' && 'bg-green-600'), onMouseEnter: function () { return setIsHovering(true); }, onMouseLeave: function () { return setIsHovering(false); } }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex items-center justify-between flex-wrap" }, { children: [(0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex-1 flex items-center" }, { children: [(0, jsx_runtime_1.jsxs)("span", __assign({ className: (0, classnames_1.default)('flex p-2 rounded-lg', status === 'info' && 'bg-indigo-800', status === 'error' && 'bg-red-800', status === 'warning' && 'bg-yellow-800', status === 'success' && 'bg-green-800') }, { children: [status === 'info' && ((0, jsx_runtime_1.jsx)(ExclamationCircleIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })), status === 'warning' && ((0, jsx_runtime_1.jsx)(ExclamationTriangleIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })), status === 'success' && ((0, jsx_runtime_1.jsx)(CheckIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })), status === 'error' && ((0, jsx_runtime_1.jsx)(XCircleIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" }))] })), (0, jsx_runtime_1.jsx)("p", __assign({ className: "ms-3 font-medium text-white" }, { children: label ? "".concat(label, ": ").concat(message) : message }))] })), count != null && count > 1 && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "order-3 mt-2 flex-shrink-0 flex-grow-1 w-full sm:order-2 sm:mt-0 sm:w-auto" }, { children: (0, jsx_runtime_1.jsxs)("span", __assign({ className: (0, classnames_1.default)('flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-mediu bg-white select-none', status === 'info' && 'text-indigo-600', status === 'error' && 'text-red-600', status === 'warning' && 'text-yellow-600', status === 'success' && 'text-green-600') }, { children: ["x", count] })) }))), dismiss && ((0, jsx_runtime_1.jsx)("div", __assign({ className: "order-2 flex-shrink-0 sm:order-3 sm:ms-2" }, { children: (0, jsx_runtime_1.jsxs)("button", __assign({ type: "button", className: (0, classnames_1.default)('-me-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white relative', status === 'info' && 'hover:bg-indigo-500', status === 'error' && 'hover:bg-red-500', status === 'warning' && 'hover:bg-yellow-500', status === 'success' && 'hover:bg-green-500'), onClick: dismiss }, { children: [(0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: s('dismiss') })), timerNum > 0 && !isHovering && ((0, jsx_runtime_1.jsx)(StatusCircleSvg, { status: status, dismiss: dismiss, timer: timerNum, count: count != null && count > 1 ? count : 1 })), (0, jsx_runtime_1.jsx)(XMarkIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })] })) })))] })) })));
}
exports.default = SiteMessage;
