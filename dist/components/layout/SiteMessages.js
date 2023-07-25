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
var SiteMessage_1 = __importDefault(require("../SiteMessage"));
var dashboardContext_1 = __importDefault(require("../../utils/dashboardContext"));
function siteMessageKey(m) {
    return "".concat(m.title ? "".concat(m.title, "-") : '').concat(m.status ? "".concat(m.status, "-") : 'info-').concat(m.message ? m.message : '');
}
function SiteMessages() {
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50" }, { children: (0, jsx_runtime_1.jsxs)("div", __assign({ className: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-3" }, { children: [(0, jsx_runtime_1.jsx)("noscript", { children: (0, jsx_runtime_1.jsx)(SiteMessage_1.default, { status: "warning", message: "You need JavaScript enabled for this dashboard to function properly." }) }), (0, jsx_runtime_1.jsx)(dashboardContext_1.default.Consumer, { children: function (ctx) {
                        return ctx != null &&
                            ctx.siteMessages.length > 0 &&
                            ctx.siteMessages.map(function (siteMessage) { return ((0, jsx_runtime_1.jsx)(SiteMessage_1.default, __assign({}, siteMessage, { dismiss: function () { return ctx.dismissSiteMessage(siteMessage); } }), siteMessageKey(siteMessage))); });
                    } })] })) })));
}
exports.default = SiteMessages;
