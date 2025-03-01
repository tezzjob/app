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
exports.applyToJob = exports.createEmployee = void 0;
var prisma_1 = __importDefault(require("../prisma/prisma"));
var errors_1 = require("../middlewares/errors");
var http_status_1 = __importDefault(require("http-status"));
var logger_1 = __importDefault(require("../utils/logger"));
var sendMail_1 = require("../mailer/sendMail");
var config_1 = require("../utils/config");
var createEmployee = function (employeeData) { return __awaiter(void 0, void 0, void 0, function () {
    var employee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                employee = null;
                //transaction: if something fails then it will abort all operation including previously created or updated records
                return [4 /*yield*/, prisma_1.default.$transaction(function (prisma) { return __awaiter(void 0, void 0, void 0, function () {
                        var name, email, locality, mobile, existing, matchingShops;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    logger_1.default.info('Received request to create an employee');
                                    name = employeeData.name, email = employeeData.email, locality = employeeData.locality, mobile = employeeData.mobile;
                                    return [4 /*yield*/, prisma.employee.findUnique({ where: { email: email } })];
                                case 1:
                                    existing = _a.sent();
                                    if (existing) {
                                        throw new errors_1.ApiError(http_status_1.default.UNPROCESSABLE_ENTITY, 'Email is already registered with Tezzjob');
                                    }
                                    return [4 /*yield*/, prisma.employee.findUnique({ where: { mobile: mobile } })];
                                case 2:
                                    existing = _a.sent();
                                    if (existing) {
                                        throw new errors_1.ApiError(http_status_1.default.UNPROCESSABLE_ENTITY, 'Mobile is already registered with Tezzjob');
                                    }
                                    return [4 /*yield*/, prisma.employee.create({
                                            data: {
                                                name: name,
                                                email: email,
                                                mobile: mobile,
                                                locality: locality,
                                            },
                                        })];
                                case 3:
                                    //create employee in db
                                    employee = _a.sent();
                                    return [4 /*yield*/, setEmployeeRelavantJobs(prisma, employee)];
                                case 4:
                                    matchingShops = _a.sent();
                                    //if this condition fails employee will not be created in db
                                    if (matchingShops.length === 0)
                                        throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "No Matching jobs found for preferred locations!");
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                    //if employee is created then send email
                ];
            case 1:
                //transaction: if something fails then it will abort all operation including previously created or updated records
                _a.sent();
                if (!employee) return [3 /*break*/, 3];
                return [4 /*yield*/, sendEmailWrapper(employee)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createEmployee = createEmployee;
var sendEmailWrapper = function (employee) { return __awaiter(void 0, void 0, void 0, function () {
    var employeeShopMappings, jobListHtml, emailBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.employeeShopMapping.findMany({
                    where: {
                        employeeId: employee.id,
                    },
                    include: {
                        shop: {
                            select: {
                                shopName: true,
                                ownerName: true,
                                shopLocation: true,
                                ownerEmail: true,
                                ownerMobile: true,
                                jobPostings: {
                                    select: {
                                        id: true,
                                        jobTitle: true,
                                        salaryPerMonth: true,
                                        timingFrom: true,
                                        timingTo: true,
                                    },
                                },
                            },
                        },
                    },
                })];
            case 1:
                employeeShopMappings = _a.sent();
                console.log(employeeShopMappings);
                if (!(employeeShopMappings.length > 0)) return [3 /*break*/, 3];
                jobListHtml = employeeShopMappings
                    .map(function (mapping) {
                    var jobPostingsHtml = mapping.shop.jobPostings
                        .map(function (job) {
                        var applyLink = "".concat(config_1.APP_URL, "/apply?employeeId=").concat(employee.id, "&jobId=").concat(job.id);
                        return "\n              <li style=\"margin-bottom: 5px;\">\n                <p style=\"margin: 0;\">Job Title: ".concat(job.jobTitle, "</p>\n                <p style=\"margin: 0;\">Salary: \u20B9").concat(job.salaryPerMonth, "</p>\n                <p style=\"margin: 0;\">Timing: ").concat(job.timingFrom, " - ").concat(job.timingTo, "</p>\n                <a href=\"").concat(applyLink, "\" style=\"color: #007bff; text-decoration: none;\">Apply for this job</a>\n              </li>\n            ");
                    })
                        .join('');
                    return "\n          <li style=\"margin-bottom: 10px;\">\n            <h4 style=\"margin: 0;\">".concat(mapping.shop.shopName, "</h4>\n            <p style=\"margin: 0;\">Owner: ").concat(mapping.shop.ownerName, "</p>\n            <p style=\"margin: 0;\">Location: ").concat(mapping.shop.shopLocation, "</p>\n            <p style=\"margin: 0;\">Email: ").concat(mapping.shop.ownerEmail, "</p>\n            <p style=\"margin: 0;\">Contact: ").concat(mapping.shop.ownerMobile, "</p>\n            <ul style=\"list-style-type: none; padding: 0; margin-top: 10px;\">\n              ").concat(jobPostingsHtml, "\n            </ul>\n            <hr />\n          </li>\n        ");
                })
                    .join('');
                emailBody = "\n      <div style=\"font-family: Arial, sans-serif; line-height: 1.6; color: #333;\">\n        <h2>Hi ".concat(employee.name, ",</h2>\n        <p>Welcome to TezzJob! We have found <strong>").concat(employeeShopMappings.length, "</strong> jobs that match your preferred locations. Here are the details:</p>\n        <ul style=\"list-style-type: none; padding: 0;\">\n          ").concat(jobListHtml, "\n        </ul>\n        <p>Best of luck with your applications!</p>\n        <p>Regards,<br/>TezzJob Team</p>\n      </div>\n    ");
                return [4 /*yield*/, (0, sendMail_1.sendEmail)(employee.email, "Found ".concat(employeeShopMappings.length, " jobs matching your preferred locations!"), emailBody)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                logger_1.default.error("Failed to send email for 0 matching jobs, employeeId: ".concat(employee.id));
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
var setEmployeeRelavantJobs = function (prisma, employee) { return __awaiter(void 0, void 0, void 0, function () {
    var locality, matchingLocalitiesShops, mapping, _i, matchingLocalitiesShops_1, shop;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                locality = employee.locality;
                console.log(locality);
                return [4 /*yield*/, prisma.shop.findMany({
                        where: {
                            shopLocation: {
                                in: locality
                            }
                        }
                    })];
            case 1:
                matchingLocalitiesShops = _a.sent();
                mapping = [];
                for (_i = 0, matchingLocalitiesShops_1 = matchingLocalitiesShops; _i < matchingLocalitiesShops_1.length; _i++) {
                    shop = matchingLocalitiesShops_1[_i];
                    mapping.push({ employeeId: employee.id, shopId: shop.id });
                }
                return [4 /*yield*/, prisma.employeeShopMapping.createMany({
                        data: mapping
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, matchingLocalitiesShops];
        }
    });
}); };
var applyToJob = function (employeeId, jobPostId) { return __awaiter(void 0, void 0, void 0, function () {
    var employee, job, mapping;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma_1.default.employee.findUnique({
                    where: {
                        id: employeeId
                    }
                })];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Employee who is trying to apply does not exist");
                }
                return [4 /*yield*/, prisma_1.default.jobPosting.findUnique({
                        where: {
                            id: jobPostId
                        }
                    })];
            case 2:
                job = _a.sent();
                if (!job) {
                    throw new errors_1.ApiError(http_status_1.default.BAD_REQUEST, "Job posting does not exist");
                }
                return [4 /*yield*/, prisma_1.default.employeeJobPostingMapping.findFirst({
                        where: {
                            employeeId: employeeId,
                            jobPostingId: jobPostId
                        }
                    })];
            case 3:
                mapping = _a.sent();
                if (!!mapping) return [3 /*break*/, 5];
                return [4 /*yield*/, prisma_1.default.employeeJobPostingMapping.create({
                        data: {
                            employeeId: employeeId,
                            jobPostingId: jobPostId
                        }
                    })];
            case 4:
                mapping = _a.sent();
                _a.label = 5;
            case 5: return [2 /*return*/, mapping];
        }
    });
}); };
exports.applyToJob = applyToJob;
