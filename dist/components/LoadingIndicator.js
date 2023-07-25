"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var classnames_1 = __importDefault(require("classnames"));
function LoadingIndicator(_a) {
    var className = _a.className;
    return (0, jsx_runtime_1.jsx)("div", { className: (0, classnames_1.default)(className, 'loading-indicator') });
}
exports.default = LoadingIndicator;
