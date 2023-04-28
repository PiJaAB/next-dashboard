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
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.LayoutStateProvider = void 0;
var react_1 = __importStar(require("react"));
var configContext_1 = __importDefault(require("./configContext"));
var logger_1 = __importDefault(require("./logger"));
var defaultContext = {
    getState: function (_, defaultValue) {
        return defaultValue;
    },
    setState: function (_, __) { },
    getTemp: function (_, defaultValue) {
        return defaultValue;
    },
    setTemp: function (_, __) { },
    modalActive: false,
    setModalActive: function () { },
    defaultColorScheme: 'light',
};
var LayoutContext = react_1.default.createContext(defaultContext);
LayoutContext.displayName = 'LayoutContext';
var persistTimeout = null;
function LayoutStateProvider(_a) {
    var children = _a.children;
    var configCtx = (0, react_1.useContext)(configContext_1.default);
    var configCtxRef = (0, react_1.useRef)(configCtx);
    configCtxRef.current = configCtx;
    var _b = __read((0, react_1.useState)(configCtx.defaultTheme), 2), defaultColorScheme = _b[0], setDefaultColorScheme = _b[1];
    (0, react_1.useEffect)(function () {
        if (!configCtx.autoDetectTheme)
            return undefined;
        var colorSchemeQuery = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined'
            ? window.matchMedia('(prefers-color-scheme: dark)')
            : null;
        if (colorSchemeQuery == null) {
            return undefined;
        }
        setDefaultColorScheme(colorSchemeQuery.matches ? 'dark' : 'light');
        var onChange = function (ev) {
            setDefaultColorScheme(ev.matches ? 'dark' : 'light');
        };
        colorSchemeQuery.addEventListener('change', onChange);
        return function () {
            colorSchemeQuery.removeEventListener('change', onChange);
        };
    }, [configCtx.autoDetectTheme]);
    (0, react_1.useEffect)(function () {
        if (!configCtx.autoDetectTheme) {
            setDefaultColorScheme(configCtx.defaultTheme);
        }
    }, [configCtx.autoDetectTheme, configCtx.defaultTheme]);
    var _c = __read((0, react_1.useState)({}), 2), persistentState = _c[0], setPersistentState = _c[1];
    var _d = __read((0, react_1.useState)({}), 2), tempState = _d[0], setTempState = _d[1];
    var _e = __read((0, react_1.useState)(false), 2), modalActive = _e[0], setModalActive = _e[1];
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
                logger_1.default.error(err);
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
    var getTemp = (0, react_1.useCallback)(function (key, defaultValue) {
        var val = tempState[key];
        if (val == null)
            return defaultValue;
        return val;
    }, [tempState]);
    var setTemp = (0, react_1.useCallback)(function (key, val) {
        setTempState(function (state) {
            var _a;
            if (state[key] === val)
                return state;
            return __assign(__assign({}, state), (_a = {}, _a[key] = val, _a));
        });
    }, [setTempState]);
    var ctx = (0, react_1.useMemo)(function () { return ({
        getState: getState,
        setState: setState,
        getTemp: getTemp,
        setTemp: setTemp,
        modalActive: modalActive,
        setModalActive: setModalActive,
        defaultColorScheme: defaultColorScheme,
    }); }, [getState, getTemp, modalActive, setState, setTemp, defaultColorScheme]);
    return (react_1.default.createElement(LayoutContext.Provider, { value: ctx }, children));
}
exports.LayoutStateProvider = LayoutStateProvider;
exports.default = LayoutContext;
