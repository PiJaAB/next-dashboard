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
exports.SEPARATOR = void 0;
/*
  This example requires Tailwind CSS v2.0+
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
var react_1 = __importStar(require("react"));
var react_tooltip_1 = __importDefault(require("react-tooltip"));
var layoutContext_1 = __importDefault(require("../../utils/layoutContext"));
var SiteMessages_1 = __importDefault(require("./SiteMessages"));
var Sidebar_1 = __importDefault(require("./Sidebar"));
var Header_1 = __importDefault(require("./Header"));
var useInitialRender_1 = __importDefault(require("../../hooks/useInitialRender"));
exports.SEPARATOR = Symbol('separator');
function DashboardLayout(_a) {
    var children = _a.children, searchText = _a.searchText, onSearchChange = _a.onSearchChange, onSearch = _a.onSearch, userMenu = _a.userMenu, Sidebar = _a.Sidebar, userTitle = _a.userTitle, userSubTitle = _a.userSubTitle, userProfilePic = _a.userProfilePic;
    var _b = (0, react_1.useContext)(layoutContext_1.default), getState = _b.getState, getTemp = _b.getTemp, setTemp = _b.setTemp, defaultColorScheme = _b.defaultColorScheme;
    var colorScheme = getState('colorScheme', defaultColorScheme);
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
    return (react_1.default.createElement("div", { className: "relative h-screen flex overflow-hidden" },
        Sidebar !== false && (react_1.default.createElement(Sidebar_1.default, { groupedUserMenu: groupedUserMenu, searchText: displaySearchText, showSearch: showSearch, handleSearchChange: handleSearchChange, handleSearchDown: handleSearchDown, setSidebarOpen: setSidebarOpen, sidebarOpen: sidebarOpen, SidebarComp: typeof Sidebar !== 'boolean' ? Sidebar : undefined, userTitle: userTitle, userSubTitle: userSubTitle, userProfilePic: userProfilePic })),
        react_1.default.createElement("div", { className: "flex flex-col w-0 flex-1 min-h-screen overflow-hidden" },
            Sidebar !== false && (react_1.default.createElement(Header_1.default, { setSidebarOpen: setSidebarOpen, groupedUserMenu: groupedUserMenu, searchText: displaySearchText, showSearch: showSearch, handleSearchChange: handleSearchChange, handleSearchDown: handleSearchDown, showMenuButton: Sidebar != null, userTitle: userTitle, userSubTitle: userSubTitle, userProfilePic: userProfilePic })),
            react_1.default.createElement("main", { className: "flex-1 relative z-0 overflow-y-auto focus:outline-none" },
                children,
                react_1.default.createElement(SiteMessages_1.default, null))),
        react_1.default.createElement("div", { id: "dashboard-modal-root" }),
        !isInitial && (react_1.default.createElement(react_tooltip_1.default, { className: "tooltip-style", type: colorScheme, effect: "solid" }))));
}
exports.default = DashboardLayout;
