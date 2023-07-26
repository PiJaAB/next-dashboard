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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@headlessui/react");
var XMarkIcon_1 = __importDefault(require("@heroicons/react/24/outline/XMarkIcon"));
var MagnifyingGlassIcon_1 = __importDefault(require("@heroicons/react/24/solid/MagnifyingGlassIcon"));
var ChevronUpDownIcon_1 = __importDefault(require("@heroicons/react/24/solid/ChevronUpDownIcon"));
var UserIcon_1 = __importDefault(require("@heroicons/react/24/solid/UserIcon"));
var react_2 = require("react");
var classnames_1 = __importDefault(require("classnames"));
var link_1 = __importDefault(require("next/link"));
var ArrowSmIcons_1 = require("../ArrowSmIcons");
var useRebuildTooltip_1 = __importDefault(require("../../hooks/useRebuildTooltip"));
var useColorScheme_1 = __importDefault(require("../../hooks/useColorScheme"));
var configContext_1 = __importDefault(require("../../utils/configContext"));
var layoutContext_1 = __importDefault(require("../../utils/layoutContext"));
var useS_1 = __importDefault(require("../../hooks/useS"));
var UserMenu_1 = __importDefault(require("./components/UserMenu"));
var NavEntry_1 = __importStar(require("../NavEntry"));
var NavSection_1 = __importDefault(require("../NavSection"));
var ThemeSelector_1 = __importDefault(require("../ThemeSelector"));
function inferBadge(size) {
    var _a;
    var env = (_a = process.env.VERCEL_ENV) !== null && _a !== void 0 ? _a : process.env.NODE_ENV;
    if (env == null || env === '') {
        return size === 'small' ? 'UKNW' : 'UNKNOWN ENV';
    }
    switch (env) {
        case 'production':
            return 'LIVE';
        case 'preview':
            return size === 'small' ? 'PRVW' : 'PREVIEW';
        case 'development':
            return size === 'small' ? 'DEV' : 'DEVELOPMENT';
        default:
            return env.toUpperCase();
    }
}
var defaultBadgeClassName = 'bg-primary-600 text-primary-100';
function EnvironmentBadge(_a) {
    var size = _a.size, environmentBadge = _a.environmentBadge;
    var badge = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d;
        var toParse = environmentBadge === true ? inferBadge(size) : environmentBadge;
        if (!toParse)
            return null;
        if (typeof toParse === 'string') {
            return {
                text: toParse,
                className: defaultBadgeClassName,
            };
        }
        if (size === 'small') {
            return {
                text: (_a = toParse.shortText) !== null && _a !== void 0 ? _a : toParse.text,
                className: (_b = toParse.className) !== null && _b !== void 0 ? _b : defaultBadgeClassName,
            };
        }
        return {
            text: (_c = toParse.longText) !== null && _c !== void 0 ? _c : toParse.text,
            className: (_d = toParse.className) !== null && _d !== void 0 ? _d : defaultBadgeClassName,
        };
    }, [environmentBadge, size]);
    if (badge == null)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "inline-block mb-4 rounded-r-3xl font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden max-w-full self-start" }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: badge.className }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "py-1 px-2 text-ellipsis overflow-hidden" }, { children: badge.text })) })) })));
}
function UserInfo(_a) {
    var title = _a.title, subTitle = _a.subTitle, pictureUrl = _a.pictureUrl, compact = _a.compact, showSelector = _a.showSelector;
    if (compact) {
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', pictureUrl == null && 'bg-gray-300'), "data-tip": title, "data-place": "right" }, { children: pictureUrl == null ? ((0, jsx_runtime_1.jsx)(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('".concat(pictureUrl, "')") } })) })));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("span", __assign({ className: "flex flex-1 min-w-0 items-center justify-center space-s-3" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: (0, classnames_1.default)('w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative', pictureUrl == null && 'bg-gray-300') }, { children: pictureUrl == null ? ((0, jsx_runtime_1.jsx)(UserIcon_1.default, { className: "h-full w-auto text-gray-500" })) : ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-cover bg-no-repeat", style: { backgroundImage: "url('".concat(pictureUrl, "')") } })) })), (title != null || subTitle != null) && ((0, jsx_runtime_1.jsxs)("span", __assign({ className: "flex-1 flex flex-col min-w-0" }, { children: [title != null && ((0, jsx_runtime_1.jsx)("span", __assign({ className: "text-gray-900 dark:text-gray-100 text-sm font-medium truncate" }, { children: title }))), subTitle != null && ((0, jsx_runtime_1.jsx)("span", __assign({ className: "text-gray-500 text-sm truncate" }, { children: subTitle })))] })))] })), showSelector && ((0, jsx_runtime_1.jsx)(ChevronUpDownIcon_1.default, { className: "flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500", "aria-hidden": "true" }))] }));
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
        return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "px-3 mt-6 relative inline-block text-start" }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "group w-full rounded-md px-3.5 py-2 text-sm text-start font-medium text-gray-700" }, { children: (0, jsx_runtime_1.jsx)("span", __assign({ className: "flex w-full justify-between items-center" }, { children: (0, jsx_runtime_1.jsx)(UserInfo, { title: userTitle, subTitle: userSubTitle, pictureUrl: userProfilePic, compact: compact }) })) })) })));
    }
    return ((0, jsx_runtime_1.jsxs)(react_1.Menu, __assign({ as: "div", className: "px-3 mt-6 relative inline-block text-start" }, { children: [(0, jsx_runtime_1.jsx)(react_1.Menu.Button, __assign({ className: "group w-full rounded-md px-3.5 py-2 text-sm text-start font-medium text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-focus-500 dark:focus:ring-offset-gray-900 dark:focus:ring-focus-500" }, { children: (0, jsx_runtime_1.jsx)("span", __assign({ className: "flex w-full justify-between items-center" }, { children: (0, jsx_runtime_1.jsx)(UserInfo, { title: userTitle, subTitle: userSubTitle, pictureUrl: userProfilePic, showSelector: true, compact: compact }) })) })), (0, jsx_runtime_1.jsx)(UserMenu_1.default, { className: (0, classnames_1.default)(compact && 'start-0 w-48', !compact && 'end-0 start-0'), userTitle: compact ? userTitle : undefined, userSubTitle: compact ? userSubTitle : undefined, groupedUserMenu: groupedUserMenu })] })));
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
    var colorScheme = (0, useColorScheme_1.default)();
    var branding = (0, react_2.useContext)(configContext_1.default).branding;
    var fullLogoUrl = getLogoURL(branding.fullLogoURL, colorScheme);
    var squareLogoUrl = getLogoURL(branding.squareLogoURL, colorScheme);
    if (compact) {
        if (squareLogoUrl)
            return ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ href: branding.homepageURL || '/', className: "flex justify-center items-center flex-shrink-0 px-6", "data-tip": branding.name, "data-place": "right" }, { children: (0, jsx_runtime_1.jsx)("img", { className: "h-auto w-10", src: squareLogoUrl, alt: branding.name }) })));
        return null;
    }
    if (fullLogoUrl != null) {
        return ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ href: branding.homepageURL || '/', className: "flex items-center justify-center flex-shrink-0 px-6" }, { children: (0, jsx_runtime_1.jsx)("img", { className: "h-8 w-auto", src: fullLogoUrl, alt: branding.name }) })));
    }
    var title = ((0, jsx_runtime_1.jsx)("h1", __assign({ className: "text-2xl text-gray-600 dark:text-gray-300" }, { children: branding.name })));
    if (squareLogoUrl != null) {
        return ((0, jsx_runtime_1.jsxs)(link_1.default, __assign({ href: branding.homepageURL || '/', className: "flex items-center justify-center flex-shrink-0 px-6" }, { children: [(0, jsx_runtime_1.jsx)("img", { className: "h-8 w-auto me-2", src: squareLogoUrl, alt: branding.name }), title] })));
    }
    return ((0, jsx_runtime_1.jsx)(link_1.default, __assign({ href: branding.homepageURL || '/', className: "flex items-center flex-shrink-0 px-6" }, { children: "title" })));
}
function Sidebar(_a) {
    var groupedUserMenu = _a.groupedUserMenu, handleSearchChange = _a.handleSearchChange, handleSearchDown = _a.handleSearchDown, searchText = _a.searchText, showSearch = _a.showSearch, sidebarOpen = _a.sidebarOpen, setSidebarOpen = _a.setSidebarOpen, SidebarComp = _a.SidebarComp, userTitle = _a.userTitle, userSubTitle = _a.userSubTitle, userProfilePic = _a.userProfilePic, environmentBadge = _a.environmentBadge;
    var _b = (0, react_2.useContext)(layoutContext_1.default), getState = _b.getState, setState = _b.setState;
    var themeSelect = (0, react_2.useContext)(configContext_1.default).themeSelect;
    var isCompact = getState('compactSidebar', false);
    var s = (0, useS_1.default)();
    var rebuildTooltip = (0, useRebuildTooltip_1.default)();
    (0, react_2.useEffect)(function () {
        rebuildTooltip();
    }, [isCompact, rebuildTooltip]);
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, classnames_1.default)('z-20', !isCompact && 'lg:w-64', isCompact && 'lg:w-24') }, { children: [SidebarComp != null && ((0, jsx_runtime_1.jsx)(react_1.Transition.Root, __assign({ show: sidebarOpen, as: react_2.Fragment }, { children: (0, jsx_runtime_1.jsxs)(react_1.Dialog, __assign({ as: "div", className: "fixed inset-0 flex lg:hidden", style: { zIndex: 8888 }, onClose: setSidebarOpen }, { children: [(0, jsx_runtime_1.jsx)(react_1.Transition.Child, __assign({ as: react_2.Fragment, enter: "transition-opacity ease-linear duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "transition-opacity ease-linear duration-300", leaveFrom: "opacity-100", leaveTo: "opacity-0" }, { children: (0, jsx_runtime_1.jsx)(react_1.Dialog.Overlay, { className: "fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black dark:bg-opacity-60" }) })), (0, jsx_runtime_1.jsx)(react_1.Transition.Child, __assign({ as: react_2.Fragment, enter: "transition ease-in-out duration-300 transform", enterFrom: "-translate-x-full", enterTo: "translate-x-0", leave: "transition ease-in-out duration-300 transform", leaveFrom: "translate-x-0", leaveTo: "-translate-x-full" }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-200 dark:bg-gray-700" }, { children: [(0, jsx_runtime_1.jsx)(react_1.Transition.Child, __assign({ as: react_2.Fragment, enter: "ease-in-out duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "ease-in-out duration-300", leaveFrom: "opacity-100", leaveTo: "opacity-0" }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "absolute top-0 right-0 -me-12 pt-2" }, { children: (0, jsx_runtime_1.jsxs)("button", __assign({ type: "button", className: "ms-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white", onClick: function () { return setSidebarOpen(false); } }, { children: [(0, jsx_runtime_1.jsx)("span", __assign({ className: "sr-only" }, { children: s('close-sidebar') })), (0, jsx_runtime_1.jsx)(XMarkIcon_1.default, { className: "h-6 w-6 text-white", "aria-hidden": "true" })] })) })) })), environmentBadge ? ((0, jsx_runtime_1.jsx)(EnvironmentBadge, { environmentBadge: environmentBadge, size: "small" })) : null, (0, jsx_runtime_1.jsx)(Brand, { compact: false }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "px-2 mt-5 divide-y divide-gray-300 dark:divide-gray-500" }, { children: [(0, jsx_runtime_1.jsx)(SidebarComp, {}), themeSelect && ((0, jsx_runtime_1.jsx)(NavSection_1.default, __assign({ className: "py-2" }, { children: (0, jsx_runtime_1.jsx)(ThemeSelector_1.default, {}) })))] }))] })) })), (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 w-14", "aria-hidden": "true" })] })) }))), (0, jsx_runtime_1.jsx)(NavEntry_1.IsCompactProvider, __assign({ value: isCompact }, { children: (0, jsx_runtime_1.jsx)("div", __assign({ className: "hidden lg:flex lg:flex-shrink-0 fixed h-screen" }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: (0, classnames_1.default)('flex flex-col border-e border-gray-200 dark:border-gray-700 pt-5 pb-4 bg-gray-200 dark:bg-gray-700', !isCompact && 'w-64', isCompact && 'w-24') }, { children: [environmentBadge ? ((0, jsx_runtime_1.jsx)(EnvironmentBadge, { environmentBadge: environmentBadge, size: isCompact ? 'small' : 'large' })) : null, (0, jsx_runtime_1.jsx)(Brand, { compact: isCompact }), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "h-0 flex-1 flex flex-col" }, { children: [(0, jsx_runtime_1.jsx)(UserAccountArea, { groupedUserMenu: groupedUserMenu, userTitle: userTitle, userSubTitle: userSubTitle, userProfilePic: userProfilePic, compact: isCompact }), showSearch && ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "px-3 mt-5" }, { children: [(0, jsx_runtime_1.jsx)("label", __assign({ htmlFor: "search", className: "sr-only" }, { children: s('search') })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "mt-1 relative rounded-md shadow-sm" }, { children: [(0, jsx_runtime_1.jsx)("div", __assign({ className: "absolute inset-y-0 left-0 ps-3 flex items-center pointer-events-none", "aria-hidden": "true" }, { children: (0, jsx_runtime_1.jsx)(MagnifyingGlassIcon_1.default, { className: "me-3 h-4 w-4 text-gray-400", "aria-hidden": "true" }) })), (0, jsx_runtime_1.jsx)("input", { type: "text", name: "search", id: "search", className: "block w-full ps-9", placeholder: s('search'), value: searchText, onChange: handleSearchChange, onKeyDown: handleSearchDown })] }))] }))), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "px-3 mt-6 divide-y divide-gray-300 dark:divide-gray-500" }, { children: [SidebarComp != null && (0, jsx_runtime_1.jsx)(SidebarComp, {}), (0, jsx_runtime_1.jsxs)(NavSection_1.default, __assign({ className: "py-2" }, { children: [themeSelect && (0, jsx_runtime_1.jsx)(ThemeSelector_1.default, {}), (0, jsx_runtime_1.jsx)(NavEntry_1.default, __assign({ Icon: isCompact ? ArrowSmIcons_1.ArrowSmallEndIcon : ArrowSmIcons_1.ArrowSmallStartIcon, onClick: function () { return setState('compactSidebar', !isCompact); } }, { children: s(isCompact ? 'sidebar-expand' : 'sidebar-compact') }))] }))] }))] }))] })) })) }))] })));
}
exports.default = Sidebar;
