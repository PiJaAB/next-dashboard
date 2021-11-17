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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@headlessui/react");
var XIcon_1 = __importDefault(require("@heroicons/react/outline/XIcon"));
var SearchIcon_1 = __importDefault(require("@heroicons/react/solid/SearchIcon"));
var SelectorIcon_1 = __importDefault(require("@heroicons/react/solid/SelectorIcon"));
var UserIcon_1 = __importDefault(require("@heroicons/react/solid/UserIcon"));
var react_2 = __importStar(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var link_1 = __importDefault(require("next/link"));
var ArrowSmIcons_1 = require("../ArrowSmIcons");
var useRebuildTooltip_1 = __importDefault(require("../../hooks/useRebuildTooltip"));
var configContext_1 = __importDefault(require("../../utils/configContext"));
var layoutContext_1 = __importDefault(require("../../utils/layoutContext"));
var useS_1 = __importDefault(require("../../hooks/useS"));
var UserMenu_1 = __importDefault(require("./components/UserMenu"));
var NavEntry_1 = __importStar(require("../NavEntry"));
var NavSection_1 = __importDefault(require("../NavSection"));
var ThemeSelector_1 = __importDefault(require("../ThemeSelector"));
function UserInfo(_a) {
    var title = _a.title, subTitle = _a.subTitle, pictureUrl = _a.pictureUrl, compact = _a.compact, showSelector = _a.showSelector;
    if (compact) {
        return (react_2.default.createElement("div", { className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', pictureUrl == null && 'bg-gray-300'), "data-tip": title, "data-place": "right" }, pictureUrl == null ? (react_2.default.createElement(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : (react_2.default.createElement("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('" + pictureUrl + "')" } }))));
    }
    return (react_2.default.createElement(react_2.default.Fragment, null,
        react_2.default.createElement("span", { className: "flex flex-1 min-w-0 items-center justify-center space-s-3" },
            react_2.default.createElement("div", { className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', pictureUrl == null && 'bg-gray-300') }, pictureUrl == null ? (react_2.default.createElement(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : (react_2.default.createElement("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('" + pictureUrl + "')" } }))),
            (title != null || subTitle != null) && (react_2.default.createElement("span", { className: "flex-1 flex flex-col min-w-0" },
                title != null && (react_2.default.createElement("span", { className: "text-gray-900 dark:text-gray-100 text-sm font-medium truncate" }, title)),
                subTitle != null && (react_2.default.createElement("span", { className: "text-gray-500 text-sm truncate" }, subTitle))))),
        showSelector && (react_2.default.createElement(SelectorIcon_1.default, { className: "flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500", "aria-hidden": "true" }))));
}
function UserAccountArea(_a) {
    var groupedUserMenu = _a.groupedUserMenu, userTitle = _a.userTitle, userSubTitle = _a.userSubTitle, userProfilePic = _a.userProfilePic, compact = _a.compact;
    if (groupedUserMenu.length === 0 &&
        userTitle == null &&
        userSubTitle == null &&
        userProfilePic == null) {
        return null;
    }
    if (groupedUserMenu.length === 0) {
        return (react_2.default.createElement("div", { className: "px-3 mt-6 relative inline-block text-start" },
            react_2.default.createElement("div", { className: "group w-full rounded-md px-3.5 py-2 text-sm text-start font-medium text-gray-700" },
                react_2.default.createElement("span", { className: "flex w-full justify-between items-center" },
                    react_2.default.createElement(UserInfo, { title: userTitle, subTitle: userSubTitle, pictureUrl: userProfilePic, compact: compact })))));
    }
    return (react_2.default.createElement(react_1.Menu, { as: "div", className: "px-3 mt-6 relative inline-block text-start" },
        react_2.default.createElement(react_1.Menu.Button, { className: "group w-full rounded-md px-3.5 py-2 text-sm text-start font-medium text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500 dark:focus:ring-offset-gray-900 dark:focus:ring-purple-500" },
            react_2.default.createElement("span", { className: "flex w-full justify-between items-center" },
                react_2.default.createElement(UserInfo, { title: userTitle, subTitle: userSubTitle, pictureUrl: userProfilePic, showSelector: true, compact: compact }))),
        react_2.default.createElement(UserMenu_1.default, { className: (0, classnames_1.default)(compact && 'start-0 w-48', !compact && 'end-0 start-0'), userTitle: compact ? userTitle : undefined, userSubTitle: compact ? userSubTitle : undefined, groupedUserMenu: groupedUserMenu })));
}
var getLogoURL = function (conf, colorScheme) {
    if (conf == null)
        return null;
    if (typeof conf === 'object') {
        return conf[colorScheme];
    }
    return conf;
};
function Brand(_a) {
    var compact = _a.compact;
    var _b = (0, react_2.useContext)(layoutContext_1.default), defaultColorScheme = _b.defaultColorScheme, getState = _b.getState;
    var colorScheme = getState('colorScheme', defaultColorScheme);
    var branding = (0, react_2.useContext)(configContext_1.default).branding;
    var fullLogoUrl = getLogoURL(branding.fullLogoURL, colorScheme);
    var squareLogoUrl = getLogoURL(branding.squareLogoURL, colorScheme);
    if (compact) {
        if (squareLogoUrl)
            return (react_2.default.createElement(link_1.default, { href: branding.homepageURL || '/' },
                react_2.default.createElement("a", { className: "flex justify-center items-center flex-shrink-0 px-6", "data-tip": branding.name, "data-place": "right" },
                    react_2.default.createElement("img", { className: "h-auto w-10", src: squareLogoUrl, alt: branding.name }))));
        return null;
    }
    if (fullLogoUrl != null) {
        return (react_2.default.createElement(link_1.default, { href: branding.homepageURL || '/' },
            react_2.default.createElement("a", { className: "flex items-center flex-shrink-0 px-6" },
                react_2.default.createElement("img", { className: "h-8 w-auto", src: fullLogoUrl, alt: branding.name }))));
    }
    var title = (react_2.default.createElement("h1", { className: "text-2xl text-gray-600 dark:text-gray-300" }, branding.name));
    if (squareLogoUrl != null) {
        return (react_2.default.createElement(link_1.default, { href: branding.homepageURL || '/' },
            react_2.default.createElement("a", { className: "flex items-center flex-shrink-0 px-6" },
                react_2.default.createElement("img", { className: "h-8 w-auto me-2", src: squareLogoUrl, alt: branding.name }),
                title)));
    }
    return (react_2.default.createElement(link_1.default, { href: branding.homepageURL || '/' },
        react_2.default.createElement("a", { className: "flex items-center flex-shrink-0 px-6" }, "title")));
}
function Sidebar(_a) {
    var groupedUserMenu = _a.groupedUserMenu, handleSearchChange = _a.handleSearchChange, handleSearchDown = _a.handleSearchDown, searchText = _a.searchText, showSearch = _a.showSearch, sidebarOpen = _a.sidebarOpen, setSidebarOpen = _a.setSidebarOpen, SidebarComp = _a.SidebarComp, userTitle = _a.userTitle, userSubTitle = _a.userSubTitle, userProfilePic = _a.userProfilePic;
    var _b = (0, react_2.useContext)(layoutContext_1.default), getState = _b.getState, setState = _b.setState;
    var isCompact = getState('compactSidebar', false);
    var s = (0, useS_1.default)();
    var rebuildTooltip = (0, useRebuildTooltip_1.default)();
    (0, react_2.useEffect)(function () {
        rebuildTooltip();
    }, [isCompact, rebuildTooltip]);
    return (react_2.default.createElement("div", { className: (0, classnames_1.default)('z-20', !isCompact && 'lg:w-64', isCompact && 'lg:w-24') },
        SidebarComp != null && (react_2.default.createElement(react_1.Transition.Root, { show: sidebarOpen, as: react_2.Fragment },
            react_2.default.createElement(react_1.Dialog, { as: "div", className: "fixed inset-0 flex lg:hidden", style: { zIndex: 8888 }, onClose: setSidebarOpen },
                react_2.default.createElement(react_1.Transition.Child, { as: react_2.Fragment, enter: "transition-opacity ease-linear duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "transition-opacity ease-linear duration-300", leaveFrom: "opacity-100", leaveTo: "opacity-0" },
                    react_2.default.createElement(react_1.Dialog.Overlay, { className: "fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black dark:bg-opacity-60" })),
                react_2.default.createElement(react_1.Transition.Child, { as: react_2.Fragment, enter: "transition ease-in-out duration-300 transform", enterFrom: "-translate-x-full", enterTo: "translate-x-0", leave: "transition ease-in-out duration-300 transform", leaveFrom: "translate-x-0", leaveTo: "-translate-x-full" },
                    react_2.default.createElement("div", { className: "relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-200 dark:bg-gray-700" },
                        react_2.default.createElement(react_1.Transition.Child, { as: react_2.Fragment, enter: "ease-in-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in-out duration-300", leaveFrom: "opacity-100", leaveTo: "opacity-0" },
                            react_2.default.createElement("div", { className: "absolute top-0 right-0 -me-12 pt-2" },
                                react_2.default.createElement("button", { type: "button", className: "ms-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white", onClick: function () { return setSidebarOpen(false); } },
                                    react_2.default.createElement("span", { className: "sr-only" }, s('close-sidebar')),
                                    react_2.default.createElement(XIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })))),
                        react_2.default.createElement(Brand, { compact: false }),
                        react_2.default.createElement("div", { className: "px-2 mt-5 divide-y divide-gray-300 dark:divide-gray-500" },
                            react_2.default.createElement(SidebarComp, null),
                            react_2.default.createElement(NavSection_1.default, { className: "py-2" },
                                react_2.default.createElement(ThemeSelector_1.default, null))))),
                react_2.default.createElement("div", { className: "flex-shrink-0 w-14", "aria-hidden": "true" })))),
        react_2.default.createElement(NavEntry_1.IsCompactProvider, { value: isCompact },
            react_2.default.createElement("div", { className: "hidden lg:flex lg:flex-shrink-0 fixed h-screen" },
                react_2.default.createElement("div", { className: (0, classnames_1.default)('flex flex-col border-e border-gray-200 dark:border-gray-700 pt-5 pb-4 bg-gray-200 dark:bg-gray-700', !isCompact && 'w-64', isCompact && 'w-24') },
                    react_2.default.createElement(Brand, { compact: isCompact }),
                    react_2.default.createElement("div", { className: "h-0 flex-1 flex flex-col" },
                        react_2.default.createElement(UserAccountArea, { groupedUserMenu: groupedUserMenu, userTitle: userTitle, userSubTitle: userSubTitle, userProfilePic: userProfilePic, compact: isCompact }),
                        showSearch && (react_2.default.createElement("div", { className: "px-3 mt-5" },
                            react_2.default.createElement("label", { htmlFor: "search", className: "sr-only" }, s('search')),
                            react_2.default.createElement("div", { className: "mt-1 relative rounded-md shadow-sm" },
                                react_2.default.createElement("div", { className: "absolute inset-y-0 left-0 ps-3 flex items-center pointer-events-none", "aria-hidden": "true" },
                                    react_2.default.createElement(SearchIcon_1.default, { className: "me-3 h-4 w-4 text-gray-400", "aria-hidden": "true" })),
                                react_2.default.createElement("input", { type: "text", name: "search", id: "search", className: "block w-full ps-9", placeholder: s('search'), value: searchText, onChange: handleSearchChange, onKeyDown: handleSearchDown })))),
                        react_2.default.createElement("div", { className: "px-3 mt-6 divide-y divide-gray-300 dark:divide-gray-500" },
                            SidebarComp != null && react_2.default.createElement(SidebarComp, null),
                            react_2.default.createElement(NavSection_1.default, { className: "py-2" },
                                react_2.default.createElement(ThemeSelector_1.default, null),
                                react_2.default.createElement(NavEntry_1.default, { Icon: isCompact ? ArrowSmIcons_1.ArrowSmEndIcon : ArrowSmIcons_1.ArrowSmStartIcon, onClick: function () { return setState('compactSidebar', !isCompact); } }, s(isCompact ? 'sidebar-expand' : 'sidebar-compact'))))))))));
}
exports.default = Sidebar;
