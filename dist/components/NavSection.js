"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var classnames_1 = __importDefault(require("classnames"));
var react_1 = __importDefault(require("react"));
function NavSection(_a) {
    var children = _a.children, className = _a.className;
    return react_1.default.createElement("div", { className: (0, classnames_1.default)('space-y-1', className) }, children);
}
exports.default = NavSection;
