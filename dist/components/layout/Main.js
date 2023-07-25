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
exports.SEPARATOR = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var router_1 = __importDefault(require("next/router"));
var react_tooltip_1 = __importDefault(require("react-tooltip"));
var layoutContext_1 = __importDefault(require("../../utils/layoutContext"));
var SiteMessages_1 = __importDefault(require("./SiteMessages"));
var Sidebar_1 = __importDefault(require("./Sidebar"));
var Header_1 = __importDefault(require("./Header"));
var useInitialRender_1 = __importDefault(require("../../hooks/useInitialRender"));
var useColorScheme_1 = __importDefault(require("../../hooks/useColorScheme"));
var ConfirmDialogue_1 = __importDefault(require("./components/ConfirmDialogue"));
exports.SEPARATOR = Symbol('separator');
function DashboardLayout(_a) {
    var children = _a.children, searchText = _a.searchText, onSearchChange = _a.onSearchChange, onSearch = _a.onSearch, userMenu = _a.userMenu, Sidebar = _a.Sidebar, userTitle = _a.userTitle, userSubTitle = _a.userSubTitle, userProfilePic = _a.userProfilePic, showDevelopmentLabel = _a.showDevelopmentLabel;
    var _b = (0, react_1.useContext)(layoutContext_1.default), getTemp = _b.getTemp, setTemp = _b.setTemp;
    var colorScheme = (0, useColorScheme_1.default)();
    (0, react_1.useEffect)(function () {
        if (typeof window === 'undefined')
            return undefined;
        window.document.body.classList.add(colorScheme);
        return function () {
            window.document.body.classList.remove(colorScheme);
        };
    }, [colorScheme]);
    var sidebarOpen = getTemp('sidebarOpen', false);
    var setSidebarOpen = (0, react_1.useCallback)(function (val) { return setTemp('sidebarOpen', val); }, [setTemp]);
    (0, react_1.useEffect)(function () {
        var onRouteChangeStart = function () {
            setSidebarOpen(false);
        };
        router_1.default.events.on('routeChangeStart', onRouteChangeStart);
        return function () {
            router_1.default.events.off('routeChangeStart', onRouteChangeStart);
        };
    }, [setSidebarOpen]);
    // The search elements need to be internally controlled if not
    // controlled from the outside due to the fact that we have
    // 2 different elements being search boxes that we want to
    // be seamlessly in sync.
    var _c = __read((0, react_1.useState)(''), 2), internalSearchText = _c[0], setInternalSearchText = _c[1];
    var displaySearchText = searchText == null ? internalSearchText : searchText;
    var controlled = searchText != null;
    var showSearch = controlled || onSearchChange != null || onSearch != null;
    var handleSearchChange = (0, react_1.useMemo)(function () {
        if (controlled) {
            return onSearchChange
                ? function (ev) {
                    onSearchChange(ev.target.value);
                }
                : undefined;
        }
        return onSearchChange
            ? function (ev) {
                onSearchChange(ev.target.value);
                setInternalSearchText(ev.target.value);
            }
            : function (ev) {
                setInternalSearchText(ev.target.value);
            };
    }, [onSearchChange, controlled]);
    var handleSearchDown = (0, react_1.useMemo)(function () {
        return onSearch != null
            ? function (ev) {
                if (ev.key === 'Enter' && !ev.shiftKey) {
                    onSearch(ev.currentTarget.value);
                }
            }
            : undefined;
    }, [onSearch]);
    var groupedUserMenu = (0, react_1.useMemo)(function () {
        var c = userMenu === null || userMenu === void 0 ? void 0 : userMenu.filter(function (m) { return m != null; });
        if (c == null)
            return [];
        if (c.length > 0 && c[c.length - 1] === exports.SEPARATOR)
            c.pop();
        var grouped = [];
        var current = [];
        c.forEach(function (e) {
            if (e === exports.SEPARATOR) {
                if (current.length > 0) {
                    grouped.push(current);
                    current = [];
                }
            }
            else {
                current.push(e);
            }
        });
        if (current.length > 0)
            grouped.push(current);
        return grouped;
    }, [userMenu]);
    var isInitial = (0, useInitialRender_1.default)();
    return ((0, jsx_runtime_1.jsxs)("div", __assign({ className: "relative flex" }, { children: [Sidebar !== false && ((0, jsx_runtime_1.jsx)(Sidebar_1.default, { groupedUserMenu: groupedUserMenu, searchText: displaySearchText, showSearch: showSearch, handleSearchChange: handleSearchChange, handleSearchDown: handleSearchDown, setSidebarOpen: setSidebarOpen, sidebarOpen: sidebarOpen, SidebarComp: typeof Sidebar !== 'boolean' ? Sidebar : undefined, userTitle: userTitle, userSubTitle: userSubTitle, userProfilePic: userProfilePic, showDevelopmentLabel: showDevelopmentLabel })), (0, jsx_runtime_1.jsxs)("div", __assign({ className: "flex flex-col w-0 flex-1 min-h-screen" }, { children: [Sidebar !== false && ((0, jsx_runtime_1.jsx)(Header_1.default, { setSidebarOpen: setSidebarOpen, groupedUserMenu: groupedUserMenu, searchText: displaySearchText, showSearch: showSearch, handleSearchChange: handleSearchChange, handleSearchDown: handleSearchDown, showMenuButton: Sidebar != null, userTitle: userTitle, userSubTitle: userSubTitle, userProfilePic: userProfilePic })), (0, jsx_runtime_1.jsxs)("main", __assign({ className: "flex-1 focus:outline-none" }, { children: [children, (0, jsx_runtime_1.jsx)(SiteMessages_1.default, {})] }))] })), (0, jsx_runtime_1.jsx)(ConfirmDialogue_1.default, {}), (0, jsx_runtime_1.jsx)("div", { id: "dashboard-modal-root", style: { zIndex: 9999 } }), !isInitial && ((0, jsx_runtime_1.jsx)(react_tooltip_1.default, { className: "tooltip-style", type: colorScheme, effect: "solid" }))] })));
}
exports.default = DashboardLayout;
