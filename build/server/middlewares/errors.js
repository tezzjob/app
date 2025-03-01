"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.errorHandler = exports.errorConverter = exports.ApiError = void 0;
require("express-async-errors");
var http_status_1 = __importDefault(require("http-status"));
var config_1 = require("../utils/config");
var logger_1 = __importDefault(require("../utils/logger"));
var library_1 = require("@prisma/client/runtime/library");
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(statusCode, message, isOperational, stack) {
        if (isOperational === void 0) { isOperational = true; }
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.isOperational = isOperational;
        if (stack) {
            _this.stack = stack;
        }
        else {
            Error.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }
    return ApiError;
}(Error));
exports.ApiError = ApiError;
var errorConverter = function (err, _req, _res, next) {
    var error = err;
    if (error instanceof library_1.PrismaClientValidationError) {
        var statusCode = http_status_1.default.BAD_REQUEST;
        error = new ApiError(http_status_1.default.BAD_REQUEST, http_status_1.default[statusCode], true, err.stack);
    }
    else if (!(err.statusCode && err.message)) {
        var statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        var message = http_status_1.default[statusCode];
        error = new ApiError(statusCode, message, true, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var errorHandler = function (err, _req, res, _next) {
    var statusCode = err.statusCode, message = err.message;
    if (config_1.IS_PRODUCTION && !err.isOperational) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = http_status_1.default[http_status_1.default.INTERNAL_SERVER_ERROR].toString();
    }
    res.locals.errorMessage = err.message;
    var response = __assign({ code: statusCode, message: message }, (!config_1.IS_PRODUCTION && { stack: err.stack }));
    logger_1.default.error(err);
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
