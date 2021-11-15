"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardStringsSwedish = exports.dashboardStringsEnglish = exports.confirmDialogue = exports.statusReporter = exports.createPersistentState = exports.LayoutContext = exports.DashboardContext = exports.ConfigContext = void 0;
var configContext_1 = require("./configContext");
Object.defineProperty(exports, "ConfigContext", { enumerable: true, get: function () { return __importDefault(configContext_1).default; } });
var dashboardContext_1 = require("./dashboardContext");
Object.defineProperty(exports, "DashboardContext", { enumerable: true, get: function () { return __importDefault(dashboardContext_1).default; } });
var layoutContext_1 = require("./layoutContext");
Object.defineProperty(exports, "LayoutContext", { enumerable: true, get: function () { return __importDefault(layoutContext_1).default; } });
var persistentState_1 = require("./persistentState");
Object.defineProperty(exports, "createPersistentState", { enumerable: true, get: function () { return __importDefault(persistentState_1).default; } });
__exportStar(require("./types"), exports);
__exportStar(require("./consoleError"), exports);
__exportStar(require("./silentError"), exports);
var statusReporter_1 = require("./statusReporter");
Object.defineProperty(exports, "statusReporter", { enumerable: true, get: function () { return __importDefault(statusReporter_1).default; } });
var confirmDialogue_1 = require("./confirmDialogue");
Object.defineProperty(exports, "confirmDialogue", { enumerable: true, get: function () { return __importDefault(confirmDialogue_1).default; } });
var dashboardStringsEnglish_1 = require("./dashboardStringsEnglish");
Object.defineProperty(exports, "dashboardStringsEnglish", { enumerable: true, get: function () { return __importDefault(dashboardStringsEnglish_1).default; } });
var dashboardStringsSwedish_1 = require("./dashboardStringsSwedish");
Object.defineProperty(exports, "dashboardStringsSwedish", { enumerable: true, get: function () { return __importDefault(dashboardStringsSwedish_1).default; } });
