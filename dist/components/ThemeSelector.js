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
var react_tooltip_1 = __importDefault(require("react-tooltip"));
var react_1 = require("react");
var SwatchIcon_1 = __importDefault(require("@heroicons/react/24/outline/SwatchIcon"));
var NavEntry_1 = __importDefault(require("./NavEntry"));
var layoutContext_1 = __importDefault(require("../utils/layoutContext"));
var useS_1 = __importDefault(require("../hooks/useS"));
var useRebuildTooltip_1 = __importDefault(require("../hooks/useRebuildTooltip"));
var useColorScheme_1 = __importDefault(require("../hooks/useColorScheme"));
function ThemeSelector(_a) {
    var children = _a.children;
    var setState = (0, react_1.useContext)(layoutContext_1.default).setState;
    var currentColorScheme = (0, useColorScheme_1.default)();
    var ref = (0, react_1.useRef)(null);
    var _b = __read((0, react_1.useState)(false), 2), reshow = _b[0], setReshow = _b[1];
    var rebuildTooltip = (0, useRebuildTooltip_1.default)();
    (0, react_1.useEffect)(function () {
        rebuildTooltip();
    }, [currentColorScheme, rebuildTooltip]);
    (0, react_1.useEffect)(function () {
        if (!reshow)
            return;
        setReshow(false);
        if (ref.current != null)
            react_tooltip_1.default.show(ref.current);
    }, [reshow]);
    var s = (0, useS_1.default)();
    return ((0, jsx_runtime_1.jsx)(NavEntry_1.default, __assign({ Icon: SwatchIcon_1.default, onClick: function () {
            setReshow(true);
            setState('colorScheme', currentColorScheme === 'dark' ? 'light' : 'dark');
        }, tipRef: ref }, { children: children || s("theme-".concat(currentColorScheme)) })));
}
exports.default = ThemeSelector;
