"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringsProvider = void 0;
var react_1 = require("react");
var logger_1 = __importDefault(require("../utils/logger"));
var dashboardStringsEnglish_1 = __importDefault(require("../utils/dashboardStringsEnglish"));
var StringsContext = (0, react_1.createContext)(dashboardStringsEnglish_1.default);
exports.StringsProvider = StringsContext.Provider;
function useS() {
    var strings = (0, react_1.useContext)(StringsContext);
    return (0, react_1.useCallback)(function (key) {
        if (process.env.NODE_ENV === 'development') {
            if (!(key in strings))
                logger_1.default.warn("key '".concat(key, " is missing in strings"));
        }
        var str = strings[key];
        return str == null ? key : str;
    }, [strings]);
}
exports.default = useS;
