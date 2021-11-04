"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorEventEmitter = void 0;
var events_1 = __importDefault(require("events"));
exports.errorEventEmitter = new events_1.default();
var ErrorReporter = /** @class */ (function () {
    function ErrorReporter() {
        var _this = this;
        this.timeout = null;
        this.cache = [];
        var runQueue = function () {
            var _a;
            var unresolved = [];
            while (_this.cache.length > 0) {
                var entry = _this.cache.pop();
                var err = entry.err, resolve = entry.resolve;
                if (err instanceof Error &&
                    exports.errorEventEmitter.listenerCount('error') > 0) {
                    resolve(exports.errorEventEmitter.emit('error', err));
                }
                else if (exports.errorEventEmitter.listenerCount('error') > 0) {
                    resolve(exports.errorEventEmitter.emit('report', err));
                }
                else {
                    unresolved.push(entry);
                }
            }
            (_a = _this.cache).push.apply(_a, __spreadArray([], __read(unresolved), false));
        };
        exports.errorEventEmitter.on('newListener', function () {
            if (exports.errorEventEmitter.listenerCount('error') === 0 ||
                exports.errorEventEmitter.listenerCount('report') === 0) {
                // The EventEmitter instance will emit its own 'newListener' event before a listener is added to its internal array of listeners.
                if (_this.timeout == null) {
                    _this.timeout = setTimeout(function () {
                        _this.timeout = null;
                        runQueue();
                    }, 0);
                }
            }
        });
        this.report = this.report.bind(this);
    }
    ErrorReporter.prototype.report = function (err) {
        var _this = this;
        if (err instanceof Error && exports.errorEventEmitter.listenerCount('error') > 0) {
            return Promise.resolve(exports.errorEventEmitter.emit('error', err));
        }
        if (exports.errorEventEmitter.listenerCount('report') > 0) {
            return Promise.resolve(exports.errorEventEmitter.emit('report', err));
        }
        return new Promise(function (resolve) {
            _this.cache.unshift({
                resolve: resolve,
                err: err,
            });
        });
    };
    return ErrorReporter;
}());
exports.default = new ErrorReporter();
