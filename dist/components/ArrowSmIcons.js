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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowSmEndIcon = exports.ArrowSmStartIcon = void 0;
var react_1 = __importDefault(require("react"));
var ArrowSmLeftIcon_1 = __importDefault(require("@heroicons/react/outline/ArrowSmLeftIcon"));
var ArrowSmRightIcon_1 = __importDefault(require("@heroicons/react/outline/ArrowSmRightIcon"));
var classnames_1 = __importDefault(require("classnames"));
function ArrowSmStartIcon(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (react_1.default.createElement(ArrowSmLeftIcon_1.default, __assign({}, props, { className: (0, classnames_1.default)(className, 'rtl:flip') })));
}
exports.ArrowSmStartIcon = ArrowSmStartIcon;
function ArrowSmEndIcon(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (react_1.default.createElement(ArrowSmRightIcon_1.default, __assign({}, props, { className: (0, classnames_1.default)(className, 'rtl:flip') })));
}
exports.ArrowSmEndIcon = ArrowSmEndIcon;
