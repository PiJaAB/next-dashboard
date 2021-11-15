"use strict";
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
exports.IsCompactProvider = void 0;
/* eslint-disable react/require-default-props */
var react_1 = __importStar(require("react"));
var router_1 = require("next/router");
var link_1 = __importDefault(require("next/link"));
var classnames_1 = __importDefault(require("classnames"));
var logger_1 = __importDefault(require("../utils/logger"));
var IsCompactContext = (0, react_1.createContext)(false);
exports.IsCompactProvider = IsCompactContext.Provider;
function Inner(_a) {
    var Icon = _a.Icon, children = _a.children, active = _a.active, isCompact = _a.isCompact;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        Icon != null && (react_1.default.createElement(Icon, { className: (0, classnames_1.default)(active
                ? 'text-onPrimary-400'
                : 'text-gray-600 dark:text-gray-300 group-hover:text-onPrimary-100 dark:group-hover:text-onPrimary-900', !isCompact && 'me-3', 'flex-shrink-0 h-6 w-6'), "aria-hidden": "true" })),
        react_1.default.createElement("span", { className: (0, classnames_1.default)(isCompact && 'sr-only', !isCompact &&
                'overflow-hidden overflow-ellipsis flex-grow flex-shrink text-start') }, children)));
}
var LinkEl = react_1.default.forwardRef(function (_a, ref) {
    var onClick = _a.onClick, href = _a.href, as = _a.as, active = _a.active, Icon = _a.Icon, children = _a.children, isCompact = _a.isCompact;
    if (onClick) {
        logger_1.default.debug('`onClick` not supported with href. If you need both, use raw render.');
    }
    return (react_1.default.createElement(link_1.default, { href: href, as: as },
        react_1.default.createElement("a", { className: (0, classnames_1.default)(active
                ? 'bg-primary-400 text-onPrimary-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-onPrimary-100 dark:hover:text-onPrimary-900 hover:bg-primary-100 dark:hover:bg-primary-900', isCompact && 'justify-center', 'w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md'), "data-tip": isCompact ? children : undefined, "data-place": "right", "aria-current": active ? 'page' : undefined, ref: ref },
            react_1.default.createElement(Inner, { Icon: Icon, active: active, isCompact: isCompact }, children))));
});
var ButtonEl = react_1.default.forwardRef(function (_a, ref) {
    var children = _a.children, onClick = _a.onClick, active = _a.active, Icon = _a.Icon, as = _a.as, isCompact = _a.isCompact;
    if (as) {
        logger_1.default.debug('`as` makes no sense without href.');
    }
    return (react_1.default.createElement("button", { ref: ref, type: "button", onClick: onClick, className: (0, classnames_1.default)(active
            ? 'bg-primary-400 text-onPrimary-400'
            : 'text-gray-600 dark:text-gray-300 hover:text-onPrimary-100 dark:hover:text-onPrimary-900 hover:bg-primary-100 dark:hover:bg-primary-900', isCompact && 'justify-center', 'w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md'), "data-tip": isCompact ? children : undefined, "data-place": "right", "aria-current": active },
        react_1.default.createElement(Inner, { Icon: Icon, active: active, isCompact: isCompact }, children)));
});
function ClonedEl(_a) {
    var className = _a.className, el = _a.el;
    return react_1.default.cloneElement(el, {
        className: (0, classnames_1.default)(el.props.className, className),
    });
}
function NavEntry(_a) {
    var _b, _c, _d;
    var href = _a.href, rawChildren = _a.children, Icon = _a.Icon, OpenIcon = _a.OpenIcon, as = _a.as, propActive = _a.active, onClick = _a.onClick, tipRef = _a.tipRef;
    var router = (0, router_1.useRouter)();
    var pathRef = (_d = (_c = (_b = href === null || href === void 0 ? void 0 : href.split('#', 1)) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.split('?', 1)) === null || _d === void 0 ? void 0 : _d[0];
    var active = propActive != null ? propActive : pathRef === router.pathname;
    var isCompact = (0, react_1.useContext)(IsCompactContext);
    var open = (0, react_1.useMemo)(function () {
        if (propActive != null)
            return propActive;
        return pathRef == null ? false : router.pathname.startsWith(pathRef);
    }, [propActive, pathRef, router.pathname]);
    var _e = __read((0, react_1.useMemo)(function () {
        var _a;
        var c;
        var rest = null;
        if (typeof rawChildren === 'string') {
            c = rawChildren;
        }
        else if (Array.isArray(rawChildren) &&
            rawChildren.length === 2 &&
            typeof rawChildren[0] === 'string') {
            _a = __read(rawChildren, 2), c = _a[0], rest = _a[1];
        }
        else {
            console.warn('Invalid children passed to NavEntry');
            c = '';
        }
        return [c, rest];
    }, [rawChildren]), 2), children = _e[0], submenu = _e[1];
    var child;
    var IconToRender = open ? OpenIcon || Icon : Icon;
    if (href) {
        child = (react_1.default.createElement(LinkEl, { active: active, href: href, Icon: IconToRender, as: as, onClick: onClick, ref: tipRef, isCompact: isCompact }, children));
    }
    else {
        child = (react_1.default.createElement(ButtonEl, { active: active, Icon: IconToRender, as: as, onClick: onClick, ref: tipRef, isCompact: isCompact }, children));
    }
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(open &&
            submenu != null &&
            'bg-black bg-opacity-10 dark:bg-opacity-25 rounded-md') },
        child,
        open && submenu != null && react_1.default.createElement(ClonedEl, { el: submenu })));
}
exports.default = NavEntry;
