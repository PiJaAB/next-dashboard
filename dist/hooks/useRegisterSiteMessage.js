"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var dashboardContext_1 = __importDefault(require("../utils/dashboardContext"));
function useRegisterSiteMessage() {
    var registerSiteMessage = (0, react_1.useContext)(dashboardContext_1.default).registerSiteMessage;
    return registerSiteMessage;
}
exports.default = useRegisterSiteMessage;
