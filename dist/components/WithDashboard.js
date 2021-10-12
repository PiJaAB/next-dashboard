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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var configContext_1 = __importStar(require("../utils/configContext"));
var dashboardContext_1 = require("../utils/dashboardContext");
var dashboardStringsEnglish_1 = __importDefault(require("../utils/dashboardStringsEnglish"));
var useS_1 = require("../hooks/useS");
function WithDashboard(_a) {
    var config = _a.config, _b = _a.strings, strings = _b === void 0 ? dashboardStringsEnglish_1.default : _b, children = _a.children;
    var configCtx = (0, react_1.useMemo)(function () { return (0, configContext_1.buildConfigContext)(config); }, [config]);
    var computedStrings = (0, react_1.useMemo)(function () {
        if (strings == null)
            return dashboardStringsEnglish_1.default;
        return __assign(__assign({}, dashboardStringsEnglish_1.default), strings);
    }, [strings]);
    return (react_1.default.createElement(useS_1.StringsProvider, { value: computedStrings },
        react_1.default.createElement(configContext_1.default.Provider, { value: configCtx },
            react_1.default.createElement(dashboardContext_1.DashboardProvider, null, children))));
}
exports.default = WithDashboard;
