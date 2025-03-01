"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.resetPassword = exports.setEmployeeAcceptStatus = exports.getApplicants = exports.createJobPost = exports.getShopDetails = exports.getShop = exports.verifyShop = exports.registerShop = void 0;
var prisma_1 = __importDefault(require("../prisma/prisma"));
var errors_1 = require("../middlewares/errors");
var http_status_1 = __importDefault(require("http-status"));
var sendMail_1 = require("../mailer/sendMail");
var config_1 = require("../utils/config");
var registerShop = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var existingShop, shop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (req.password.length === 0 || req.confirmPassword !== req.password)
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Passwords doesn't match");
                return [4 /*yield*/, prisma_1.default.shop.findFirst({
                        where: {
                            ownerEmail: req.ownerEmail
                        }
                    })];
            case 1:
                existingShop = _a.sent();
                if (existingShop !== null) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "shop for this owner email already exists! Please login");
                }
                return [4 /*yield*/, prisma_1.default.shop.findFirst({
                        where: {
                            ownerMobile: req.ownerMobile,
                        },
                    })];
            case 2:
                existingShop = _a.sent();
                if (existingShop !== null) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "shop for this owner mobile already exists! Please login");
                }
                return [4 /*yield*/, prisma_1.default.shop.create({
                        data: {
                            ownerEmail: req.ownerEmail,
                            ownerMobile: req.ownerMobile,
                            password: req.password,
                            ownerName: req.ownerName,
                            shopLocation: req.shopLocation,
                            shopName: req.shopName,
                            isEmailValidated: false,
                        }
                    })];
            case 3:
                shop = _a.sent();
                return [4 /*yield*/, (0, sendMail_1.sendEmail)(shop.ownerEmail, 'Validate Email', "\n    Hi ".concat(shop.ownerName, ", <br />\n    Please click below link to verify your email \n    ").concat(config_1.APP_URL, "/verify?uuid=").concat(shop.uuid, "    \n    "))];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.registerShop = registerShop;
var verifyShop = function (uuid) { return __awaiter(void 0, void 0, void 0, function () {
    var shop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.shop.findFirst({ where: { uuid: uuid } })];
            case 1:
                shop = _a.sent();
                if (!shop) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Verification failed");
                }
                if (shop.isEmailValidated)
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Account already verified");
                return [4 /*yield*/, prisma_1.default.shop.update({
                        data: { isEmailValidated: true },
                        where: { id: shop.id },
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.verifyShop = verifyShop;
var getShop = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var shop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.shop.findUnique({
                    where: {
                        ownerEmail: email,
                    }
                })];
            case 1:
                shop = _a.sent();
                if (!shop)
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid credentials");
                return [2 /*return*/, shop];
        }
    });
}); };
exports.getShop = getShop;
var getShopDetails = function (loggedInUser) { return __awaiter(void 0, void 0, void 0, function () {
    var shop, jobPostings;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.shop.findUnique({
                    where: {
                        ownerEmail: loggedInUser.ownerEmail
                    },
                    select: {
                        shopName: true,
                        ownerEmail: true,
                        ownerMobile: true,
                        shopLocation: true,
                        businessCategory: true,
                    }
                })];
            case 1:
                shop = _a.sent();
                return [4 /*yield*/, prisma_1.default.jobPosting.findMany({
                        where: {
                            shopId: loggedInUser.shopId
                        },
                        select: {
                            jobTitle: true,
                            salaryPerMonth: true,
                            isActive: true,
                            id: true,
                            timingFrom: true,
                            timingTo: true,
                        }
                    })];
            case 2:
                jobPostings = _a.sent();
                return [2 /*return*/, {
                        shop: shop,
                        jobPostings: jobPostings
                    }];
        }
    });
}); };
exports.getShopDetails = getShopDetails;
var createJobPost = function (loggedInUser, jobPost) { return __awaiter(void 0, void 0, void 0, function () {
    var job;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.jobPosting.create({
                    data: __assign(__assign({}, jobPost), { shopId: loggedInUser.shopId })
                })];
            case 1:
                job = _a.sent();
                return [2 /*return*/, job];
        }
    });
}); };
exports.createJobPost = createJobPost;
var getApplicants = function (loggedInUser, jobPostingId) { return __awaiter(void 0, void 0, void 0, function () {
    var job, applicants;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.jobPosting.findFirst({
                    where: {
                        id: jobPostingId,
                        shopId: loggedInUser.shopId
                    }
                })];
            case 1:
                job = _a.sent();
                if (!job)
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid job id");
                return [4 /*yield*/, prisma_1.default.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  select e.id, e.name, e.email, e.mobile, ejp.is_shortlisted as \"isShortListed\"\n  from job_postings jp \n  inner join employee_job_posting_mapping ejp on jp.id = ejp.job_posting_id\n  inner join employee e on e.id = ejp.employee_id\n  where jp.id = ", "\n  "], ["\n  select e.id, e.name, e.email, e.mobile, ejp.is_shortlisted as \"isShortListed\"\n  from job_postings jp \n  inner join employee_job_posting_mapping ejp on jp.id = ejp.job_posting_id\n  inner join employee e on e.id = ejp.employee_id\n  where jp.id = ", "\n  "])), jobPostingId)];
            case 2:
                applicants = _a.sent();
                return [2 /*return*/, applicants];
        }
    });
}); };
exports.getApplicants = getApplicants;
var setEmployeeAcceptStatus = function (loggedInUser, employeeId, jobPostingId, accpet) { return __awaiter(void 0, void 0, void 0, function () {
    var job, employee, mapping;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.jobPosting.findFirst({
                    where: {
                        id: jobPostingId,
                        shopId: loggedInUser.shopId
                    }
                })];
            case 1:
                job = _a.sent();
                if (!job)
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid job id");
                return [4 /*yield*/, prisma_1.default.employee.findFirst({
                        where: {
                            id: employeeId
                        }
                    })];
            case 2:
                employee = _a.sent();
                if (!employee)
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Employee does not exist");
                return [4 /*yield*/, prisma_1.default.employeeJobPostingMapping.findFirst({
                        where: {
                            employeeId: employeeId,
                            jobPostingId: jobPostingId
                        }
                    })];
            case 3:
                mapping = _a.sent();
                if (!mapping) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Employee does not applied to this job");
                }
                return [4 /*yield*/, prisma_1.default.employeeJobPostingMapping.update({
                        where: {
                            id: mapping.id
                        },
                        data: {
                            isShortListed: accpet
                        }
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.setEmployeeAcceptStatus = setEmployeeAcceptStatus;
var resetPassword = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var shop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.shop.findFirst({
                    where: {
                        ownerEmail: email
                    }
                })];
            case 1:
                shop = _a.sent();
                if (!shop) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid email");
                }
                return [4 /*yield*/, prisma_1.default.shop.update({
                        where: {
                            id: shop.id
                        },
                        data: {
                            password: password
                        }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
var templateObject_1;
