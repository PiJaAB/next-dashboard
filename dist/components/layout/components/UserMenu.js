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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_2 = require("@headlessui/react");
var classnames_1 = __importDefault(require("classnames"));
var NextLink_1 = __importDefault(require("../../NextLink"));
function UserMenuEntry(_a) {
    var href = _a.href, onClick = _a.onClick, disabled = _a.disabled, label = _a.label;
    var isDisabled = disabled || (href == null && onClick == null);
    var className = 'block w-full text-left px-4 py-2 text-sm';
    if (isDisabled) {
        return (react_1.default.createElement(react_2.Menu.Button, { type: "button", className: (0, classnames_1.default)(className, 'text-gray-300 dark:text-gray-500 cursor-default'), disabled: true }, label));
    }
    return (react_1.default.createElement(react_2.Menu.Item, null, function (_a) {
        var active = _a.active;
        return href == null ? (react_1.default.createElement("button", { type: "button", onClick: onClick, className: (0, classnames_1.default)(className, active
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300') }, label)) : (react_1.default.createElement(NextLink_1.default, { onClick: onClick, href: href, className: (0, classnames_1.default)(className, active
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300') }, label));
    }));
}
var keyCounter = 0;
function UserMenu(_a) {
    var groupedUserMenu = _a.groupedUserMenu, className = _a.className, userTitle = _a.userTitle, userSubTitle = _a.userSubTitle;
    var keyMap = (0, react_1.useMemo)(function () { return new Map(); }, []);
    (0, react_1.useEffect)(function () {
        var curKeys = keyMap.keys();
        var flatList = groupedUserMenu.flat();
        var finish;
        do {
            var current = curKeys.next();
            finish = current.done;
            if (!current.done) {
                if (Array.isArray(current.value)) {
                    if (!groupedUserMenu.includes(current.value)) {
                        keyMap.delete(current.value);
                    }
                }
                else if (!flatList.includes(current.value)) {
                    keyMap.delete(current.value);
                }
            }
        } while (!finish);
    }, [keyMap, groupedUserMenu]);
    var getKey = (0, react_1.useCallback)(function (entry) {
        var cachedKey = keyMap.get(entry);
        if (cachedKey != null)
            return cachedKey;
        var newKey = "entry-" + keyCounter;
        keyCounter += 1;
        keyMap.set(entry, newKey);
        return newKey;
    }, [keyMap]);
    var cn = (0, classnames_1.default)(className, 'origin-top absolute mt-1 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 mx-3 divide-y divide-gray-200 dark:divide-gray-700');
    return (react_1.default.createElement(react_2.Transition, { as: react_1.Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95" }, groupedUserMenu.length > 0 ? (react_1.default.createElement(react_2.Menu.Items, { className: cn },
        (userTitle != null || userSubTitle != null) && (react_1.default.createElement("div", { className: "w-full text-left px-4 py-2 select-none" },
            userTitle != null && (react_1.default.createElement("span", { title: userTitle, className: "block text-gray-500 dark:text-gray-500 text-sm overflow-ellipsis overflow-hidden" }, userTitle)),
            userSubTitle != null && (react_1.default.createElement("span", { title: userSubTitle, className: "block text-gray-400 dark:text-gray-600 text-xs overflow-ellipsis overflow-hidden" }, userSubTitle)))),
        groupedUserMenu.map(function (group) { return (react_1.default.createElement("div", { className: "py-1", key: getKey(group) }, group.map(function (entry) { return (react_1.default.createElement(UserMenuEntry, __assign({ key: getKey(entry) }, entry))); }))); }))) : (react_1.default.createElement("div", { className: cn }, (userTitle != null || userSubTitle != null) && (react_1.default.createElement("div", { className: "w-full text-left px-4 py-2 select-none" },
        userTitle != null && (react_1.default.createElement("span", { title: userTitle, className: "block text-gray-500 dark:text-gray-500 text-sm overflow-ellipsis overflow-hidden" }, userTitle)),
        userSubTitle != null && (react_1.default.createElement("span", { title: userSubTitle, className: "block text-gray-400 dark:text-gray-600 text-xs overflow-ellipsis overflow-hidden" }, userSubTitle))))))));
}
exports.default = UserMenu;
