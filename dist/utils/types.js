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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedError = void 0;
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError(message) {
        var _a;
        var _this = this;
        var realMessage;
        try {
            var sender = (_a = new Error().stack) === null || _a === void 0 ? void 0 : _a.split('\n')[2].replace(' at ', '');
            realMessage = "The method ".concat(sender || 'UNKNOWN_METHOD', " isn't implemented.").concat(message ? "\nMessage: ".concat(message) : '');
        }
        catch (_) {
            realMessage = message || 'Function not implemented.';
        }
        _this = _super.call(this, realMessage) || this;
        _this.name = 'NotImplementedError';
        return _this;
    }
    return NotImplementedError;
}(Error));
exports.NotImplementedError = NotImplementedError;
