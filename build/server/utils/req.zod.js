"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobIdQ = exports.ApplyJob = exports.CreateJobReq = exports.UuidQueryParam = exports.LoginShopReq = exports.RegisterShopReq = exports.SignUpReq = void 0;
var zod_1 = __importDefault(require("zod"));
var validations_1 = require("./validations");
exports.SignUpReq = zod_1.default.object({
    name: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    email: zod_1.default.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    mobile: zod_1.default.string().regex(/^[6-9]\d{9}$/),
    locality: zod_1.default.array(zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces)),
});
exports.RegisterShopReq = zod_1.default.object({
    ownerName: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    ownerEmail: zod_1.default
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ownerMobile: zod_1.default.string().regex(/^[6-9]\d{9}$/),
    shopLocation: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    shopName: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    password: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    confirmPassword: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
});
exports.LoginShopReq = zod_1.default.object({
    ownerEmail: zod_1.default
        .string()
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
});
exports.UuidQueryParam = zod_1.default.object({
    query: zod_1.default.object({
        uuid: zod_1.default.string(),
    }),
});
exports.CreateJobReq = zod_1.default.object({
    jobTitle: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    salaryPerMonth: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    timingFrom: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
    timingTo: zod_1.default.string().transform(validations_1.removeExtraWhiteSpaces),
});
exports.ApplyJob = zod_1.default.object({
    query: zod_1.default.object({
        employeeId: zod_1.default.string().regex(/\d+/).transform(Number),
        jobId: zod_1.default.string().regex(/\d+/).transform(Number),
    }),
});
exports.JobIdQ = zod_1.default.object({
    query: zod_1.default.object({
        jobId: zod_1.default.string().regex(/\d+/).transform(Number),
    }),
});
