"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_2 = require("@headlessui/react");
var MenuAlt1Icon_1 = __importDefault(require("@heroicons/react/outline/MenuAlt1Icon"));
var SearchIcon_1 = __importDefault(require("@heroicons/react/solid/SearchIcon"));
var UserIcon_1 = __importDefault(require("@heroicons/react/solid/UserIcon"));
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
    return (react_1.default.createElement("div", { className: "relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 lg:hidden" },
        showMenuButton && (react_1.default.createElement("button", { type: "button", className: "px-4 border-e border-gray-200 dark:border-gray-600 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden", onClick: function () { return setSidebarOpen(true); } },
            react_1.default.createElement("span", { className: "sr-only" }, s('open-sidebar')),
            react_1.default.createElement(MenuAlt1Icon_1.default, { className: "h-6 w-6", "aria-hidden": "true" }))),
        logoURL && (react_1.default.createElement(link_1.default, { href: branding.homepageURL || '/' },
            react_1.default.createElement("a", { className: "h-full" },
                react_1.default.createElement("img", { src: logoURL, alt: branding.name, className: "h-full w-auto" })))),
        react_1.default.createElement("div", { className: "flex-1 flex justify-between px-4 sm:px-6 lg:px-8" },
            showSearch && (react_1.default.createElement("div", { className: "flex-1 flex place-items-center" },
                react_1.default.createElement("label", { htmlFor: "search-field", className: "sr-only" }, s('search')),
                react_1.default.createElement("div", { className: "relative w-full text-gray-400 focus-within:text-gray-600 dark:text-gray-600 dark:focus-within:text-gray-300" },
                    react_1.default.createElement("div", { className: "absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none" },
                        react_1.default.createElement(SearchIcon_1.default, { className: "h-5 w-5", "aria-hidden": "true" })),
                    react_1.default.createElement("input", { id: "search-field", name: "search-field", className: "block w-full ps-9", placeholder: s('search'), type: "search", value: searchText, onChange: handleSearchChange, onKeyDown: handleSearchDown })))),
            react_1.default.createElement("div", { className: "flex ms-auto items-center" }, (userTitle != null && userTitle !== '') ||
                (userTitle != null && userTitle !== '') ||
                groupedUserMenu.length > 0 ? (react_1.default.createElement(react_2.Menu, { as: "div", className: "ms-3 relative" },
                react_1.default.createElement(react_2.Menu.Button, { className: "max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" },
                    react_1.default.createElement("span", { className: "sr-only" }, s('open-user-menu')),
                    react_1.default.createElement("div", { "data-tip": userTitle, className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', userProfilePic == null && 'bg-gray-300') }, userProfilePic == null ? (react_1.default.createElement(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : (react_1.default.createElement("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('".concat(userProfilePic, "')") } })))),
                react_1.default.createElement(UserMenu_1.default, { className: "right-0 w-48", groupedUserMenu: groupedUserMenu, userTitle: userTitle, userSubTitle: userSubTitle }))) : (react_1.default.createElement("div", { className: "max-w-xs ms-3 relative flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500" },
                react_1.default.createElement("span", { className: "sr-only" }, s('profile-picture')),
                react_1.default.createElement("div", { "data-tip": userTitle, className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', userProfilePic == null && 'bg-gray-300') }, userProfilePic == null ? (react_1.default.createElement(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : (react_1.default.createElement("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('".concat(userProfilePic, "')") } })))))))));
}
exports.default = Header;
