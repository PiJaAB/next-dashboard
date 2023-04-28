"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useMutationObserver(target, options, callback) {
    var observer = (0, react_1.useMemo)(function () {
        return typeof window === 'undefined' &&
            callback &&
            new MutationObserver(callback);
    }, [callback]);
    (0, react_1.useEffect)(function () {
        if (!observer || !target || !options)
            return undefined;
        observer.observe(target, options);
        return function () {
            observer.disconnect();
        };
    }, [observer, target, options]);
}
exports.default = useMutationObserver;
