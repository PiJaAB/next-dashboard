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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var logger_1 = __importDefault(require("./logger"));
function createPersistentState(defaultState) {
    var persistentStateContext = (0, react_1.createContext)(null);
    var persistTimeout = {};
    function PersistentStateProvider(_a) {
        var name = _a.name, version = _a.version, children = _a.children;
        var _b = __read((0, react_1.useState)(defaultState), 2), curState = _b[0], setCurState = _b[1];
        var persist = (0, react_1.useCallback)(function () {
            if (persistTimeout[name] != null)
                return;
            persistTimeout[name] = window.setTimeout(function () {
                delete persistTimeout[name];
                setCurState(function (state) {
                    window.localStorage.setItem(name, JSON.stringify({
                        version: version,
                        state: state,
                    }));
                    return state;
                });
            });
        }, [name, version, setCurState]);
        (0, react_1.useEffect)(function () {
            if (typeof window === undefined)
                return undefined;
            var refresh = function () {
                var storageString = window.localStorage.getItem(name);
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
                    if (version != null &&
                        obj.version !== version) {
                        throw new Error('State version mismatch');
                    }
                    setCurState(obj.state);
                }
                catch (err) {
                    logger_1.default.error(err);
                }
            };
            refresh();
            var storageListener = function (_a) {
                var key = _a.key;
                if (key === name) {
                    refresh();
                }
            };
            window.addEventListener('storage', storageListener, {
                passive: true,
            });
            return function () {
                window.removeEventListener('storage', storageListener);
            };
        }, [name, version, setCurState]);
        var getState = (0, react_1.useCallback)(function () {
            return curState;
        }, [curState]);
        var setState = (0, react_1.useCallback)(function (keyOrState, val) {
            if (typeof keyOrState === 'object') {
                persist();
                setCurState(keyOrState);
            }
            else {
                setCurState(function (state) {
                    var _a;
                    if (state[keyOrState] === val)
                        return state;
                    persist();
                    return __assign(__assign({}, state), (_a = {}, _a[keyOrState] = val, _a));
                });
            }
        }, [setCurState, persist]);
        var ctx = (0, react_1.useMemo)(function () { return ({
            getState: getState,
            setState: setState,
        }); }, [getState, setState]);
        return (react_1.default.createElement(persistentStateContext.Provider, { value: ctx }, children));
    }
    var usePersistentState = (function (key, def) {
        var ctx = (0, react_1.useContext)(persistentStateContext);
        if (!ctx) {
            throw new Error('Attempting to use context without a context provided');
        }
        var state = ctx.getState();
        if (key != null) {
            var val = state[key];
            if (val == null && def != null) {
                return def;
            }
            return val;
        }
        return state;
    });
    return {
        PersistentStateProvider: PersistentStateProvider,
        usePersistentState: usePersistentState,
    };
}
exports.default = createPersistentState;
