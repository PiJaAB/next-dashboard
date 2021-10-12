"use strict";
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
        this.cache = [];
        var runQueue = function () {
            while (exports.errorEventEmitter.listenerCount('error') > 0 &&
                _this.cache.length > 0) {
                var _a = _this.cache.pop(), err = _a.err, resolve = _a.resolve;
                resolve(exports.errorEventEmitter.emit('error', err));
            }
        };
        exports.errorEventEmitter.on('newListener', function () {
            if (exports.errorEventEmitter.listenerCount('error') === 0) {
                // The EventEmitter instance will emit its own 'newListener' event before a listener is added to its internal array of listeners.
                setTimeout(runQueue, 0);
            }
        });
    }
    ErrorReporter.prototype.report = function (err) {
        var _this = this;
        if (exports.errorEventEmitter.listenerCount('error') > 0) {
            return Promise.resolve(exports.errorEventEmitter.emit('error', err));
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
