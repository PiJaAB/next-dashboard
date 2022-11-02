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
exports.buildConfigContext = exports.defaultContext = void 0;
var react_1 = __importDefault(require("react"));
exports.defaultContext = {
    defaultTheme: 'light',
    autoDetectTheme: true,
    themeSelect: true,
    branding: {
        name: 'PiJa Next',
    },
};
function buildConfigContext(conf) {
    return __assign(__assign({}, exports.defaultContext), conf);
}
exports.buildConfigContext = buildConfigContext;
var ConfigContext = react_1.default.createContext(exports.defaultContext);
ConfigContext.displayName = 'ConfigContext';
exports.default = ConfigContext;
