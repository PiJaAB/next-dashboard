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
var Modal_1 = __importDefault(require("../../Modal"));
var confirmDialogue_1 = require("../../../utils/confirmDialogue");
var ConfirmDialogue = function () {
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
    var _d = current || {}, renderCancel = _d.renderCancel, renderOk = _d.renderOk, message = _d.message, title = _d.title;
    return (react_1.default.createElement(Modal_1.default, { id: "confirmation-dialogue-modal", title: title || 'Bekräfta', active: isOpen, close: cancel },
        react_1.default.createElement("div", { className: "flex flex-wrap justify-between items-start" },
            react_1.default.createElement("div", { className: "w-full mb-3" }, message != null ? message : 'Är du säker?'),
            typeof renderOk === 'function' ? (renderOk(confirm)) : (react_1.default.createElement("button", { type: "button", className: "button mb-3", onClick: confirm }, renderOk != null ? renderOk : 'Ok')),
            typeof renderCancel === 'function' ? (renderCancel(cancel)) : (react_1.default.createElement("button", { type: "button", className: "button text-white dark:text-white bg-red-500 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-600 mb-3", onClick: cancel }, renderCancel != null ? renderCancel : 'Avbryt')))));
};
exports.default = ConfirmDialogue;
