"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offConfirmDialogue = exports.onConfirmDialogue = void 0;
var logger_1 = __importDefault(require("./logger"));
var cache = [];
var listener = null;
function onConfirmDialogue(newListener) {
    if (listener != null) {
        logger_1.default.warn('Tried to register confirm listener when one was already registered');
    }
    listener = newListener;
    if (cache.length === 0)
        return cache;
    var oldCache = cache;
    cache = [];
    return oldCache;
}
exports.onConfirmDialogue = onConfirmDialogue;
function offConfirmDialogue(newListener) {
    if (listener === newListener)
        listener = null;
    else
        logger_1.default.warn("Tried to remove confirm listener that wasn't registered");
}
exports.offConfirmDialogue = offConfirmDialogue;
function cancel(opts) {
    if (listener == null) {
        cache = cache.filter(function (entry) { return entry !== opts; });
    }
    else {
        listener.onCancel(opts);
    }
}
function confirm(opts) {
    if (listener != null) {
        listener.onDialogue(opts);
        return function () { return cancel(opts); };
    }
    cache.push(opts);
    return function () { return cancel(opts); };
}
exports.default = confirm;
