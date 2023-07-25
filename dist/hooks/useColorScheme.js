"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var configContext_1 = __importDefault(require("../utils/configContext"));
var layoutContext_1 = __importDefault(require("../utils/layoutContext"));
function useColorScheme() {
    var _a = (0, react_1.useContext)(layoutContext_1.default), defaultColorScheme = _a.defaultColorScheme, getState = _a.getState;
    var themeSelect = (0, react_1.useContext)(configContext_1.default).themeSelect;
    if (!themeSelect)
        return defaultColorScheme;
    return getState('colorScheme', defaultColorScheme);
}
exports.default = useColorScheme;
