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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Modal_1 = __importDefault(require("../../Modal"));
var confirmDialogue_1 = require("../../../utils/confirmDialogue");
function ConfirmDialogue() {
    var _a = __read((0, react_1.useState)([]), 2), queue = _a[0], setQueue = _a[1];
    var _b = __read((0, react_1.useState)(null), 2), current = _b[0], setCurrent = _b[1];
    var _c = __read((0, react_1.useState)(false), 2), isOpen = _c[0], setIsOpen = _c[1];
    (0, react_1.useEffect)(function () {
        if (!isOpen && queue.length > 0) {
            var _a = __read(queue, 1), next_1 = _a[0];
            setCurrent(next_1);
            setQueue(function (oldQueue) {
                return oldQueue.filter(function (entry) { return entry !== next_1; });
            });
            setIsOpen(true);
        }
    }, [queue, isOpen]);
    (0, react_1.useEffect)(function () {
        if (current != null)
            setIsOpen(true);
    }, [current]);
    var close = (0, react_1.useCallback)(function () {
        if (queue.length === 0) {
            setIsOpen(false);
        }
        else {
            var _a = __read(queue, 1), next_2 = _a[0];
            setCurrent(next_2);
            setQueue(function (oldQueue) {
                return oldQueue.filter(function (entry) { return entry !== next_2; });
            });
        }
    }, [queue]);
    (0, react_1.useEffect)(function () {
        var listener = {
            onDialogue: function (opts) {
                setQueue(function (oldQueue) { return __spreadArray(__spreadArray([], __read(oldQueue), false), [opts], false); });
            },
            onCancel: function (opts) {
                setQueue(function (oldQueue) { return oldQueue.filter(function (entry) { return entry !== opts; }); });
                if (current === opts && isOpen)
                    close();
            },
        };
        var cache = (0, confirmDialogue_1.onConfirmDialogue)(listener);
        if (cache.length > 0)
            setQueue(function (oldQueue) { return __spreadArray(__spreadArray([], __read(oldQueue), false), __read(cache), false); });
        return function () {
            (0, confirmDialogue_1.offConfirmDialogue)(listener);
        };
    }, [setQueue, setCurrent, isOpen, current, close]);
    var confirm = function () {
        if (current) {
            current.ok();
        }
        close();
    };
    var cancel = function () {
        if (current && current.cancel) {
            current.cancel();
        }
        close();
    };
    var _d = current || {}, RenderCancel = _d.renderCancel, RenderOk = _d.renderOk, message = _d.message, title = _d.title;
    return ((0, jsx_runtime_1.jsx)(Modal_1.default, __assign({ id: "confirmation-dialogue-modal", title: title || 'Bekräfta', active: isOpen, close: cancel }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex flex-wrap justify-between items-start" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "w-full mb-3" }, { children: message != null ? message : 'Är du säker?' })), typeof RenderOk === 'function' ? ((0, jsx_runtime_1.jsx)(RenderOk, { onClick: confirm })) : ((0, jsx_runtime_1.jsx)("button", __assign({ type: "button", className: "button mb-3", onClick: confirm }, { children: RenderOk != null ? RenderOk : 'Ok' }))), typeof RenderCancel === 'function' ? ((0, jsx_runtime_1.jsx)(RenderCancel, { onClick: cancel })) : ((0, jsx_runtime_1.jsx)("button", __assign({ type: "button", className: "button text-white dark:text-white bg-red-500 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-600 mb-3", onClick: cancel }, { children: RenderCancel != null ? RenderCancel : 'Avbryt' })))] })) })));
}
exports.default = ConfirmDialogue;
