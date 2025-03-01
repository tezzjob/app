"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.communicationLogger = void 0;
var winston_1 = __importDefault(require("winston"));
var config_1 = require("./config");
var enumerateErrorFormat = winston_1.default.format(function (info) {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});
var format = winston_1.default.format.combine(enumerateErrorFormat(), winston_1.default.format.colorize(), winston_1.default.format.splat(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(function (_a) {
    var level = _a.level, message = _a.message, timestamp = _a.timestamp;
    return "".concat(level, ":[").concat(timestamp, "]: ").concat(message);
}));
var transportConsole = new winston_1.default.transports.Console({
    level: "info",
    stderrLevels: ["error"],
});
var logger = winston_1.default.createLogger({
    level: config_1.IS_PRODUCTION ? "info" : "debug",
    format: format,
    //reference: https://github.com/winstonjs/winston-daily-rotate-file
    transports: transportConsole,
});
exports.communicationLogger = winston_1.default.createLogger({
    level: config_1.IS_PRODUCTION ? "info" : "debug",
    format: format,
    transports: transportConsole
});
exports.default = logger;
