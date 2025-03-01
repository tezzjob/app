"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeExtraWhiteSpaces = void 0;
exports.validateType = validateType;
var http_status_1 = __importDefault(require("http-status"));
var errors_1 = require("../middlewares/errors");
var constants_1 = require("./constants");
var removeExtraWhiteSpaces = function (input) {
    if (!input)
        throw new errors_1.ApiError(http_status_1.default.UNPROCESSABLE_ENTITY, constants_1.ErrorConstant.NULL_STRING);
    return input.replace(/\s+/g, " ").trim();
};
exports.removeExtraWhiteSpaces = removeExtraWhiteSpaces;
function validateType(schema, req) {
    try {
        return schema.parse(req);
    }
    catch (err) {
        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid Request Body", true, err);
    }
}
