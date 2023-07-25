"use strict";
// This is an Error proxy, to ensure that the automatic sitewide
// error reporter does not display this error.
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSilent = exports.SilentError = void 0;
var SilentError = /** @class */ (function (_super) {
    __extends(SilentError, _super);
    function SilentError(error) {
        var _this = this;
        if (error && typeof error === 'object') {
            _this = _super.call(this) || this;
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var self_1 = _this;
            Object.defineProperties(_this, {
                name: {
                    get: function () { return error.name; },
                },
                message: {
                    get: function () { return error.message; },
                },
                toString: {
                    get: function () {
                        if (typeof error.toString !== 'function') {
                            return error.toString;
                        }
                        return function toString() {
                            var _a;
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            var thisObj = self_1 === this ? error : this;
                            (_a = error.toString).call.apply(_a, __spreadArray([thisObj], __read(args), false));
                        };
                    },
                },
            });
        }
        else {
            _this = _super.call(this, error) || this;
        }
        return _this;
    }
    return SilentError;
}(Error));
exports.SilentError = SilentError;
SilentError.prototype.name = 'SilentError';
function makeSilent(error) {
    throw new SilentError(error);
}
exports.makeSilent = makeSilent;
