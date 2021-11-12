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
exports.DashboardProvider = void 0;
var react_1 = __importStar(require("react"));
var logger_1 = __importDefault(require("./logger"));
var layoutContext_1 = require("./layoutContext");
var silentError_1 = require("./silentError");
var errorReporter_1 = require("./errorReporter");
var defaultContext = {
    getState: function (_, defaultValue) {
        return defaultValue;
    },
    setState: function (_, __) { },
    siteMessages: [],
    registerSiteMessage: function () { },
    dismissSiteMessage: function () { },
    Comp: function () { return null; },
};
var DashboardContext = react_1.default.createContext(defaultContext);
DashboardContext.displayName = 'DashboardContext';
var persistTimeout = null;
function compareSitemessages(m1, m2) {
    if (m1.status !== m2.status)
        return false;
    if (m1.title !== m2.title)
        return false;
    if (m1.message !== m2.message)
        return false;
    if (m1.timer !== m2.timer)
        return false;
    return true;
}
function DashboardProvider(_a) {
    var children = _a.children;
    var _b = __read((0, react_1.useState)({}), 2), persistentState = _b[0], setPersistentState = _b[1];
    var persist = (0, react_1.useCallback)(function () {
        if (persistTimeout != null)
            return;
        persistTimeout = window.setTimeout(function () {
            persistTimeout = null;
            setPersistentState(function (state) {
                window.localStorage.setItem('dashboard-layout-state', JSON.stringify(state));
                return state;
            });
        }, 100);
    }, [setPersistentState]);
    (0, react_1.useEffect)(function () {
        if (typeof window === undefined)
            return undefined;
        var refresh = function () {
            var storageString = window.localStorage.getItem('dashboard-layout-state');
            if (!storageString)
                return;
            try {
                var obj = JSON.parse(storageString);
                if (typeof obj !== 'object') {
                    throw new Error('Preferences not a valid value');
                }
                if (obj == null || Array.isArray(obj)) {
                    throw new Error('Preferences not a valid value');
                }
                setPersistentState(obj);
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.error(err);
            }
        };
        refresh();
        var storageListener = function (_a) {
            var key = _a.key;
            if (key === 'dashboard-layout-state') {
                refresh();
            }
        };
        window.addEventListener('storage', storageListener, {
            passive: true,
        });
        return function () {
            window.removeEventListener('storage', storageListener);
        };
    }, [setPersistentState]);
    var getState = (0, react_1.useCallback)(function (key, defaultValue) {
        var val = persistentState[key];
        if (val == null)
            return defaultValue;
        return val;
    }, [persistentState]);
    var setState = (0, react_1.useCallback)(function (key, val) {
        setPersistentState(function (state) {
            var _a;
            if (state[key] === val)
                return state;
            persist();
            return __assign(__assign({}, state), (_a = {}, _a[key] = val, _a));
        });
    }, [persist, setPersistentState]);
    var Comp = children.type;
    var _c = __read((0, react_1.useState)([]), 2), siteMessages = _c[0], setSiteMessages = _c[1];
    var _d = __read((0, react_1.useMemo)(function () {
        var innerSiteMessages = [];
        setSiteMessages(innerSiteMessages);
        var registerSiteMessageInner = function (siteMessage) {
            if (siteMessage instanceof Error) {
                if (siteMessage instanceof silentError_1.SilentError)
                    return;
                logger_1.default.error(siteMessage);
                registerSiteMessageInner({
                    title: siteMessage.constructor.name,
                    status: 'error',
                    message: siteMessage.message,
                });
                return;
            }
            function siteMessageAdder(curSiteMessages) {
                var existingIndex = curSiteMessages.findIndex(function (m) {
                    return compareSitemessages(m, siteMessage);
                });
                var newSiteMessages;
                if (existingIndex > -1) {
                    newSiteMessages = __spreadArray([], __read(curSiteMessages), false);
                    var updatedMessage = __assign({}, curSiteMessages[existingIndex]);
                    updatedMessage.count =
                        ((updatedMessage === null || updatedMessage === void 0 ? void 0 : updatedMessage.count) != null ? updatedMessage.count : 1) + 1;
                    newSiteMessages[existingIndex] = updatedMessage;
                }
                else {
                    newSiteMessages = __spreadArray(__spreadArray([], __read(curSiteMessages), false), [siteMessage], false);
                }
                innerSiteMessages = newSiteMessages;
                return newSiteMessages;
            }
            setSiteMessages(siteMessageAdder);
        };
        function dismissSiteMessageInner(siteMessage) {
            var siteMessageDismisser = function (curSiteMessages) {
                var newMessages = curSiteMessages.filter(function (m) { return !compareSitemessages(m, siteMessage); });
                innerSiteMessages = newMessages;
                return newMessages;
            };
            setSiteMessages(siteMessageDismisser);
        }
        return [registerSiteMessageInner, dismissSiteMessageInner];
    }, [setSiteMessages]), 2), registerSiteMessage = _d[0], dismissSiteMessage = _d[1];
    (0, react_1.useEffect)(function () {
        function onError(err) {
            registerSiteMessage(err);
        }
        function onReport(msg) {
            registerSiteMessage(msg);
        }
        errorReporter_1.errorEventEmitter.on('report', onReport);
        errorReporter_1.errorEventEmitter.on('error', onError);
        return function () {
            errorReporter_1.errorEventEmitter.off('report', onReport);
            errorReporter_1.errorEventEmitter.off('error', onError);
        };
    }, [registerSiteMessage]);
    var ctx = (0, react_1.useMemo)(function () { return ({
        getState: getState,
        setState: setState,
        siteMessages: siteMessages,
        registerSiteMessage: registerSiteMessage,
        dismissSiteMessage: dismissSiteMessage,
        Comp: Comp,
    }); }, [
        Comp,
        dismissSiteMessage,
        getState,
        registerSiteMessage,
        setState,
        siteMessages,
    ]);
    return (react_1.default.createElement(DashboardContext.Provider, { value: ctx },
        react_1.default.createElement(layoutContext_1.LayoutStateProvider, null, children)));
}
exports.DashboardProvider = DashboardProvider;
exports.default = DashboardContext;
