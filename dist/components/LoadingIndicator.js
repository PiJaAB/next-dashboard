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
var react_1 = __importDefault(require("react"));
var LoadingDot = function (_a) {
    var extraStyles = _a.extraStyles, backgroundColor = _a.backgroundColor, className = _a.className, offset = _a.offset;
    return (react_1.default.createElement("span", { className: className, style: __assign({ marginLeft: offset ? '0.5rem' : undefined, backgroundColor: backgroundColor }, extraStyles) }));
};
function LoadingIndicator(_a) {
    var _b = _a.backgroundColor, backgroundColor = _b === void 0 ? '#487fff' : _b, _c = _a.extraStyles, extraStyles = _c === void 0 ? {} : _c;
    return (react_1.default.createElement("div", { className: "loading-indicator" },
        react_1.default.createElement(LoadingDot, { className: "loading-dot-1", backgroundColor: backgroundColor, extraStyles: extraStyles, offset: true }),
        react_1.default.createElement(LoadingDot, { className: "loading-dot-2", backgroundColor: backgroundColor, extraStyles: extraStyles, offset: true }),
        react_1.default.createElement(LoadingDot, { className: "loading-dot-3", backgroundColor: backgroundColor, extraStyles: extraStyles, offset: true })));
}
exports.default = LoadingIndicator;
