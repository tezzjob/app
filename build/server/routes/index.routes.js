"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var validations_1 = require("../utils/validations");
var req_zod_1 = require("../utils/req.zod");
var employee_service_1 = require("../service/employee.service");
var shopkeeper_service_1 = require("../service/shopkeeper.service");
var errors_1 = require("../middlewares/errors");
var auth_1 = require("../middlewares/auth");
var body_parser_1 = __importDefault(require("body-parser"));
var http_status_1 = __importDefault(require("http-status"));
var sendMail_1 = require("../mailer/sendMail");
var config_1 = require("../utils/config");
var routes = express_1.default.Router();
routes.use(body_parser_1.default.json());
routes.post('/employee/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = (0, validations_1.validateType)(req_zod_1.SignUpReq, req.body);
                return [4 /*yield*/, (0, employee_service_1.createEmployee)(request)];
            case 1:
                response = _a.sent();
                res.send(response);
                return [2 /*return*/];
        }
    });
}); });
routes.post('/shopkeeper/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = (0, validations_1.validateType)(req_zod_1.RegisterShopReq, req.body);
                return [4 /*yield*/, (0, shopkeeper_service_1.registerShop)(request)];
            case 1:
                response = _a.sent();
                res.send(response);
                return [2 /*return*/];
        }
    });
}); });
routes.post('/shopkeeper/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ownerEmail, password, shop, passwordIsValid, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, ownerEmail = _a.ownerEmail, password = _a.password;
                if (password === undefined || ownerEmail === undefined) {
                    res.status(400).json({ auth: false, token: null });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, shopkeeper_service_1.getShop)(ownerEmail)];
            case 1:
                shop = _b.sent();
                passwordIsValid = password === shop.password;
                if (!passwordIsValid) {
                    res.status(401).json({ auth: false, token: null });
                    return [2 /*return*/];
                }
                token = (0, auth_1.generateToken)({ shopId: shop.id, ownerEmail: shop.ownerEmail });
                res.status(200).json({ auth: true, token: token, email: shop.ownerEmail });
                return [2 /*return*/];
        }
    });
}); });
routes.get('/verify', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, msg, status, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = (0, validations_1.validateType)(req_zod_1.UuidQueryParam, req);
                if (!request.query.uuid) {
                    res
                        .status(400)
                        .json({ success: false, message: 'Unable to verify account' });
                }
                msg = 'Account verified successfully!';
                status = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, shopkeeper_service_1.verifyShop)(request.query.uuid)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                if (error_1 instanceof errors_1.ApiError)
                    msg = error_1.message;
                else
                    msg = 'Verification failed';
                status = false;
                return [3 /*break*/, 4];
            case 4:
                res.json({ success: status, message: msg });
                return [2 /*return*/];
        }
    });
}); });
routes.get('/shop-details', (0, auth_1.auth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loggedInUser, details;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loggedInUser = req.loggedInUser;
                if (!loggedInUser) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, shopkeeper_service_1.getShopDetails)(loggedInUser)];
            case 1:
                details = _a.sent();
                res.send(details);
                return [3 /*break*/, 3];
            case 2: throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Access Denied");
            case 3: return [2 /*return*/];
        }
    });
}); });
routes.post('/create-job', (0, auth_1.auth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loggedInUser, request, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loggedInUser = req.loggedInUser;
                request = (0, validations_1.validateType)(req_zod_1.CreateJobReq, req.body);
                if (!loggedInUser) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, shopkeeper_service_1.createJobPost)(loggedInUser, request)];
            case 1:
                response = _a.sent();
                res.send(response);
                return [3 /*break*/, 3];
            case 2: throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Access Denied");
            case 3: return [2 /*return*/];
        }
    });
}); });
routes.post('/apply-to-job', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = (0, validations_1.validateType)(req_zod_1.ApplyJob, req);
                return [4 /*yield*/, (0, employee_service_1.applyToJob)(request.query.employeeId, request.query.jobId)];
            case 1:
                response = _a.sent();
                res.send(response);
                return [2 /*return*/];
        }
    });
}); });
routes.post('/shortlist-employee', (0, auth_1.auth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, loggedInUser, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = (0, validations_1.validateType)(req_zod_1.ApplyJob, req);
                loggedInUser = req.loggedInUser;
                if (!loggedInUser) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, shopkeeper_service_1.setEmployeeAcceptStatus)(loggedInUser, request.query.employeeId, request.query.jobId, true)];
            case 1:
                response = _a.sent();
                res.send(response);
                return [3 /*break*/, 3];
            case 2: throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Access Denied");
            case 3: return [2 /*return*/];
        }
    });
}); });
routes.get('/applied-employees', (0, auth_1.auth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loggedInUser, request, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loggedInUser = req.loggedInUser;
                request = (0, validations_1.validateType)(req_zod_1.JobIdQ, req);
                if (!loggedInUser) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, shopkeeper_service_1.getApplicants)(loggedInUser, request.query.jobId)];
            case 1:
                response = _a.sent();
                res.send(response);
                return [3 /*break*/, 3];
            case 2: throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Access Denied");
            case 3: return [2 /*return*/];
        }
    });
}); });
routes.post('/forgot-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, resetPasswordLink, emailContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                if (!email) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Email is required");
                }
                resetPasswordLink = "".concat(config_1.APP_URL, "/reset-password?userEmail=").concat(encodeURIComponent(email));
                emailContent = "\n    <div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n      <p>Hey there,</p>\n      <p>Click on the link below to reset your password:</p>\n      <p><a href=\"".concat(resetPasswordLink, "\" style=\"color: #007bff; text-decoration: none;\">Reset Password</a></p>\n      <p>If you did not request a password reset, please ignore this email.</p>\n      <p>Regards,<br/>TezzJob Team</p>\n    </div>\n  ");
                return [4 /*yield*/, (0, sendMail_1.sendEmail)(email, 'Reset Password', emailContent)];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'Password reset email sent successfully' });
                return [2 /*return*/];
        }
    });
}); });
routes.post('/reset-password', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, response;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Email and password are required");
                }
                return [4 /*yield*/, (0, shopkeeper_service_1.resetPassword)(email, password)];
            case 1:
                response = _b.sent();
                res.send(response);
                return [2 /*return*/];
        }
    });
}); });
routes.post('/logout', function (req, res) {
    res.status(200).json({ auth: false, token: null });
});
exports.default = routes;
