"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var outline_1 = require("@heroicons/react/outline");
var classnames_1 = __importDefault(require("classnames"));
var useS_1 = __importDefault(require("../hooks/useS"));
function SiteMessage(_a) {
    var title = _a.title, message = _a.message, _b = _a.status, status = _b === void 0 ? 'info' : _b, count = _a.count, dismiss = _a.dismiss;
    var s = (0, useS_1.default)();
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)('p-2 rounded-lg shadow-lg sm:p-3', status === 'info' && 'bg-indigo-600', status === 'error' && 'bg-red-600', status === 'warning' && 'bg-yellow-600') },
        react_1.default.createElement("div", { className: "flex items-center justify-between flex-wrap" },
            react_1.default.createElement("div", { className: "flex-1 flex items-center" },
                react_1.default.createElement("span", { className: (0, classnames_1.default)('flex p-2 rounded-lg', status === 'info' && 'bg-indigo-800', status === 'error' && 'bg-red-800', status === 'warning' && 'bg-yellow-800') },
                    status === 'info' && (react_1.default.createElement(outline_1.ExclamationCircleIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" })),
                    status === 'warning' && (react_1.default.createElement(outline_1.ExclamationIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" })),
                    status === 'error' && (react_1.default.createElement(outline_1.XCircleIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }))),
                react_1.default.createElement("p", { className: "ml-3 font-medium text-white" },
                    title || s(status),
                    ": ",
                    message)),
            count != null && count > 1 && (react_1.default.createElement("div", { className: "order-3 mt-2 flex-shrink-0 flex-grow-1 w-full sm:order-2 sm:mt-0 sm:w-auto" },
                react_1.default.createElement("span", { className: (0, classnames_1.default)('flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-mediu bg-white select-none', status === 'info' && 'text-indigo-600', status === 'error' && 'text-red-600', status === 'warning' && 'text-yellow-600') },
                    "x",
                    count))),
            dismiss && (react_1.default.createElement("div", { className: "order-2 flex-shrink-0 sm:order-3 sm:ml-2" },
                react_1.default.createElement("button", { type: "button", className: (0, classnames_1.default)('-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white', status === 'info' && 'hover:bg-indigo-500', status === 'error' && 'hover:bg-red-500', status === 'warning' && 'hover:bg-yellow-500'), onClick: dismiss },
                    react_1.default.createElement("span", { className: "sr-only" }, s('dismiss')),
                    react_1.default.createElement(outline_1.XIcon, { className: "h-6 w-6 text-white", "aria-hidden": "true" })))))));
}
exports.default = SiteMessage;
