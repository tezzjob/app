"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_URL = exports.EMAIL_PASS = exports.EMAIL_USER = exports.DEFAULT_MAIL = exports.DB_URI = exports.IS_PRODUCTION = exports.ENVIRONMENT = exports.APP_PORT = void 0;
exports.APP_PORT = 8080;
exports.ENVIRONMENT = process.env.APP_ENV || "dev";
exports.IS_PRODUCTION = exports.ENVIRONMENT === "production";
var DB_URI = function () { return process.env.DB_URI || ""; };
exports.DB_URI = DB_URI;
var DEFAULT_MAIL = function () {
    return process.env.DEFAULT_MAIL || "manavithorve@gmail.com";
};
exports.DEFAULT_MAIL = DEFAULT_MAIL;
var EMAIL_USER = function () {
    return process.env.EMAIL_USER || "tezzjob.services@gmail.com";
};
exports.EMAIL_USER = EMAIL_USER;
var EMAIL_PASS = function () {
    return process.env.EMAIL_PASS || "TezzJob@12345";
};
exports.EMAIL_PASS = EMAIL_PASS;
exports.APP_URL = process.env.VITE_APP_URL || "http://localhost:3000";
