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
var react_tooltip_1 = __importDefault(require("react-tooltip"));
var react_1 = __importStar(require("react"));
var outline_1 = require("@heroicons/react/outline");
var NavEntry_1 = __importDefault(require("./NavEntry"));
var layoutContext_1 = __importDefault(require("../utils/layoutContext"));
var useS_1 = __importDefault(require("../hooks/useS"));
function ThemeSelector(_a) {
    var children = _a.children;
    var _b = (0, react_1.useContext)(layoutContext_1.default), getState = _b.getState, setState = _b.setState, defaultColorScheme = _b.defaultColorScheme;
    var currentColorScheme = getState('colorScheme', defaultColorScheme);
    var ref = (0, react_1.useRef)(null);
    var _c = __read((0, react_1.useState)(false), 2), reshow = _c[0], setReshow = _c[1];
    (0, react_1.useEffect)(function () {
        react_tooltip_1.default.rebuild();
    }, [currentColorScheme]);
    (0, react_1.useEffect)(function () {
        if (!reshow)
            return;
        console.log(ref);
        setReshow(false);
        if (ref.current != null)
            react_tooltip_1.default.show(ref.current);
    }, [reshow]);
    var s = (0, useS_1.default)();
    return (react_1.default.createElement(NavEntry_1.default, { Icon: outline_1.ColorSwatchIcon, onClick: function () {
            setReshow(true);
            setState('colorScheme', currentColorScheme === 'dark' ? 'light' : 'dark');
        }, tipRef: ref }, children || s("theme-" + currentColorScheme)));
}
exports.default = ThemeSelector;
