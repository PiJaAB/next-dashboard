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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var link_1 = __importDefault(require("next/link"));
var react_2 = require("@headlessui/react");
var classnames_1 = __importDefault(require("classnames"));
function UserMenuEntry(_a) {
    var href = _a.href, onClick = _a.onClick, disabled = _a.disabled, label = _a.label;
    var isDisabled = disabled || (href == null && onClick == null);
    var className = 'block w-full text-start px-4 py-2 text-sm';
    if (isDisabled) {
        return ((0, jsx_runtime_1.jsx)(react_2.Menu.Button, __assign({ type: "button", className: (0, classnames_1.default)(className, 'text-gray-300 dark:text-gray-500 cursor-default'), disabled: true }, { children: label })));
    }
    return ((0, jsx_runtime_1.jsx)(react_2.Menu.Item, { children: function (_a) {
            var active = _a.active;
            return href == null ? ((0, jsx_runtime_1.jsx)("button", __assign({ type: "button", onClick: onClick, className: (0, classnames_1.default)(className, active
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300') }, { children: label }))) : ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ onClick: onClick, href: href, className: (0, classnames_1.default)(className, active
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300') }, { children: label })));
        } }));
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
        var newKey = "entry-".concat(keyCounter);
        keyCounter += 1;
        keyMap.set(entry, newKey);
        return newKey;
    }, [keyMap]);
    var cn = (0, classnames_1.default)(className, 'origin-top absolute mt-1 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 mx-3 divide-y divide-gray-200 dark:divide-gray-700');
    return ((0, jsx_runtime_1.jsx)(react_2.Transition, __assign({ as: react_1.Fragment, enter: "transition ease-out duration-100", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95" }, { children: groupedUserMenu.length > 0 ? ((0, jsx_runtime_1.jsxs)(react_2.Menu.Items, __assign({ className: cn }, { children: [(userTitle != null || userSubTitle != null) && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "w-full text-start px-4 py-2 select-none" }, { children: [userTitle != null && ((0, jsx_runtime_1.jsx)("span", __assign({ title: userTitle, className: "block text-gray-500 dark:text-gray-500 text-sm overflow-ellipsis overflow-hidden" }, { children: userTitle }))), userSubTitle != null && ((0, jsx_runtime_1.jsx)("span", __assign({ title: userSubTitle, className: "block text-gray-400 dark:text-gray-600 text-xs overflow-ellipsis overflow-hidden" }, { children: userSubTitle })))] }))), groupedUserMenu.map(function (group) { return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "py-1" }, { children: group.map(function (entry) { return ((0, jsx_runtime_1.jsx)(UserMenuEntry, __assign({}, entry), getKey(entry))); }) }), getKey(group))); })] }))) : ((0, jsx_runtime_1.jsx)("div", __assign({ className: cn }, { children: (userTitle != null || userSubTitle != null) && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "w-full text-start px-4 py-2 select-none" }, { children: [userTitle != null && ((0, jsx_runtime_1.jsx)("span", __assign({ title: userTitle, className: "block text-gray-500 dark:text-gray-500 text-sm overflow-ellipsis overflow-hidden" }, { children: userTitle }))), userSubTitle != null && ((0, jsx_runtime_1.jsx)("span", __assign({ title: userSubTitle, className: "block text-gray-400 dark:text-gray-600 text-xs overflow-ellipsis overflow-hidden" }, { children: userSubTitle })))] }))) }))) })));
}
exports.default = UserMenu;
