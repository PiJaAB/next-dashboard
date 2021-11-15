"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeConsole = exports.ConsoleError = void 0;
var silentError_1 = require("./silentError");
var logger_1 = __importDefault(require("./logger"));
// This is an Error proxy, to ensure that the automatic sitewide
// error reporter does not display this error. It does however
// automatically log the error to the console.
var ConsoleError = /** @class */ (function (_super) {
    __extends(ConsoleError, _super);
    function ConsoleError(error) {
        var _this = _super.call(this, error) || this;
        logger_1.default.error(_this);
        return _this;
    }
    return ConsoleError;
}(silentError_1.SilentError));
exports.ConsoleError = ConsoleError;
silentError_1.SilentError.prototype.name = 'ConsoleError';
function makeConsole(error) {
    throw new ConsoleError(error);
}
exports.makeConsole = makeConsole;
