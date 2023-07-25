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
var react_2 = require("@headlessui/react");
var Bars3CenterLeftIcon_1 = __importDefault(require("@heroicons/react/24/outline/Bars3CenterLeftIcon"));
var MagnifyingGlassIcon_1 = __importDefault(require("@heroicons/react/24/solid/MagnifyingGlassIcon"));
var UserIcon_1 = __importDefault(require("@heroicons/react/24/solid/UserIcon"));
var link_1 = __importDefault(require("next/link"));
var classnames_1 = __importDefault(require("classnames"));
var configContext_1 = __importDefault(require("../../utils/configContext"));
var UserMenu_1 = __importDefault(require("./components/UserMenu"));
var useS_1 = __importDefault(require("../../hooks/useS"));
var useColorScheme_1 = __importDefault(require("../../hooks/useColorScheme"));
var getLogoURL = function (conf, colorScheme) {
    if (conf == null)
        return null;
    if (typeof conf === 'object') {
        return conf[colorScheme];
    }
    return conf;
};
function Header(_a) {
    var showSearch = _a.showSearch, searchText = _a.searchText, handleSearchChange = _a.handleSearchChange, handleSearchDown = _a.handleSearchDown, groupedUserMenu = _a.groupedUserMenu, setSidebarOpen = _a.setSidebarOpen, showMenuButton = _a.showMenuButton, userTitle = _a.userTitle, userSubTitle = _a.userSubTitle, userProfilePic = _a.userProfilePic;
    var branding = (0, react_1.useContext)(configContext_1.default).branding;
    var colorScheme = (0, useColorScheme_1.default)();
    var logoURL = (0, react_1.useMemo)(function () {
        return !showMenuButton ? getLogoURL(branding.squareLogoURL, colorScheme) : null;
    }, [showMenuButton, branding.squareLogoURL, colorScheme]);
    var s = (0, useS_1.default)();
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 lg:hidden" }, { children: [showMenuButton && ((0, jsx_runtime_1.jsxs)("button", __assign({ type: "button", className: "px-4 border-e border-gray-200 dark:border-gray-600 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-focus-500 lg:hidden", onClick: function () { return setSidebarOpen(true); } }, { children: [(0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: s('open-sidebar') })), (0, jsx_runtime_1.jsx)(Bars3CenterLeftIcon_1.default, { className: "h-6 w-6", "aria-hidden": "true" })] }))), logoURL && ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ href: branding.homepageURL || '/', className: "h-full" }, { children: (0, jsx_runtime_1.jsx)("img", { src: logoURL, alt: branding.name, className: "h-full w-auto" }) }))), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex-1 flex justify-between px-4 sm:px-6 lg:px-8" }, { children: [showSearch && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex-1 flex place-items-center" }, { children: [(0, jsx_runtime_1.jsx)("label", __assign({ htmlFor: "search-field", className: "sr-only" }, { children: s('search') })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative w-full text-gray-400 focus-within:text-gray-600 dark:text-gray-600 dark:focus-within:text-gray-300" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none" }, { children: (0, jsx_runtime_1.jsx)(MagnifyingGlassIcon_1.default, { className: "h-5 w-5", "aria-hidden": "true" }) })), (0, jsx_runtime_1.jsx)("input", { id: "search-field", name: "search-field", className: "block w-full ps-9", placeholder: s('search'), type: "search", value: searchText, onChange: handleSearchChange, onKeyDown: handleSearchDown })] }))] }))), (0, jsx_runtime_1.jsx)("div", __assign({ className: "flex ms-auto items-center" }, { children: (userTitle != null && userTitle !== '') ||
                            (userTitle != null && userTitle !== '') ||
                            groupedUserMenu.length > 0 ? ((0, jsx_runtime_1.jsxs)(react_2.Menu, __assign({ as: "div", className: "ms-3 relative" }, { children: [(0, jsx_runtime_1.jsxs)(react_2.Menu.Button, __assign({ className: "max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-500" }, { children: [(0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: s('open-user-menu') })), (0, jsx_runtime_1.jsx)("div", __assign({ "data-tip": userTitle, className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', userProfilePic == null && 'bg-gray-300') }, { children: userProfilePic == null ? ((0, jsx_runtime_1.jsx)(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('".concat(userProfilePic, "')") } })) }))] })), (0, jsx_runtime_1.jsx)(UserMenu_1.default, { className: "right-0 w-48", groupedUserMenu: groupedUserMenu, userTitle: userTitle, userSubTitle: userSubTitle })] }))) : ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "max-w-xs ms-3 relative flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus-500" }, { children: [(0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: s('profile-picture') })), (0, jsx_runtime_1.jsx)("div", __assign({ "data-tip": userTitle, className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', userProfilePic == null && 'bg-gray-300') }, { children: userProfilePic == null ? ((0, jsx_runtime_1.jsx)(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('".concat(userProfilePic, "')") } })) }))] }))) }))] }))] })));
}
exports.default = Header;
