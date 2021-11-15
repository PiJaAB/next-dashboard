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
var react_1 = __importDefault(require("react"));
var SiteMessage_1 = __importDefault(require("../SiteMessage"));
var dashboardContext_1 = __importDefault(require("../../utils/dashboardContext"));
function siteMessageKey(m) {
    return "" + (m.title ? m.title + "-" : '') + (m.status ? m.status + "-" : 'info-') + (m.message ? m.message : '');
}
function SiteMessages() {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50" },
            react_1.default.createElement("div", { className: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-3" },
                react_1.default.createElement("noscript", null,
                    react_1.default.createElement(SiteMessage_1.default, { status: "warning", message: "You need JavaScript enabled for this dashboard to function properly." })),
                react_1.default.createElement(dashboardContext_1.default.Consumer, null, function (ctx) {
                    return ctx != null &&
                        ctx.siteMessages.length > 0 &&
                        ctx.siteMessages.map(function (siteMessage) { return (react_1.default.createElement(SiteMessage_1.default, __assign({ key: siteMessageKey(siteMessage) }, siteMessage, { dismiss: function () { return ctx.dismissSiteMessage(siteMessage); } }))); });
                })))));
}
exports.default = SiteMessages;
