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
exports.RebuildTooltipProvider = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_tooltip_1 = __importDefault(require("react-tooltip"));
var context = (0, react_1.createContext)(function () { });
function RebuildTooltipProvider(_a) {
    var children = _a.children;
    var _b = __read((0, react_1.useState)(false), 2), shouldRebuild = _b[0], setShouldRebuild = _b[1];
    (0, react_1.useEffect)(function () {
        if (shouldRebuild) {
            react_tooltip_1.default.rebuild();
            setShouldRebuild(false);
        }
    }, [shouldRebuild]);
    var value = (0, react_1.useCallback)(function () {
        setShouldRebuild(true);
    }, []);
    return (0, jsx_runtime_1.jsx)(context.Provider, __assign({ value: value }, { children: children }));
}
exports.RebuildTooltipProvider = RebuildTooltipProvider;
function useRebuildTooltip() {
    return (0, react_1.useContext)(context);
}
exports.default = useRebuildTooltip;
