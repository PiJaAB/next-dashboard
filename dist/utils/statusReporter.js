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
exports.statusEventEmitter = void 0;
var events_1 = __importDefault(require("events"));
exports.statusEventEmitter = new events_1.default();
var StatusReporter = /** @class */ (function () {
    function StatusReporter() {
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
                    exports.statusEventEmitter.listenerCount('error') > 0) {
                    resolve(exports.statusEventEmitter.emit('error', err));
                }
                else if (exports.statusEventEmitter.listenerCount('error') > 0) {
                    resolve(exports.statusEventEmitter.emit('report', err));
                }
                else {
                    unresolved.push(entry);
                }
            }
            (_a = _this.cache).push.apply(_a, __spreadArray([], __read(unresolved), false));
        };
        exports.statusEventEmitter.on('newListener', function () {
            if (exports.statusEventEmitter.listenerCount('error') === 0 ||
                exports.statusEventEmitter.listenerCount('report') === 0) {
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
    StatusReporter.prototype.report = function (err) {
        var _this = this;
        if (err instanceof Error && exports.statusEventEmitter.listenerCount('error') > 0) {
            return Promise.resolve(exports.statusEventEmitter.emit('error', err));
        }
        if (exports.statusEventEmitter.listenerCount('report') > 0) {
            return Promise.resolve(exports.statusEventEmitter.emit('report', err));
        }
        return new Promise(function (resolve) {
            _this.cache.unshift({
                resolve: resolve,
                err: err,
            });
        });
    };
    return StatusReporter;
}());
exports.default = new StatusReporter();
