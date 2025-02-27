import z from 'zod';
import { removeExtraWhiteSpaces } from './validations';
import { query } from 'express';

export const SignUpReq = z.object({
  name: z.string().transform(removeExtraWhiteSpaces),
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  locality: z.array(z.string().transform(removeExtraWhiteSpaces)),
});

export const RegisterShopReq = z.object({
  ownerName: z.string().transform(removeExtraWhiteSpaces),
  ownerEmail: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  ownerMobile: z.string().regex(/^[6-9]\d{9}$/),
  shopLocation: z.string().transform(removeExtraWhiteSpaces),
  shopName: z.string().transform(removeExtraWhiteSpaces),
  password: z.string().transform(removeExtraWhiteSpaces),
  confirmPassword: z.string().transform(removeExtraWhiteSpaces),
});

export const LoginShopReq = z.object({
  ownerEmail: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  password: z.string().transform(removeExtraWhiteSpaces),
});

export const UuidQueryParam = z.object({
  query: z.object({
    uuid: z.string(),
  }),
});

export const CreateJobReq = z.object({
  jobTitle: z.string().transform(removeExtraWhiteSpaces),
  salaryPerMonth: z.string().transform(removeExtraWhiteSpaces),
  timingFrom: z.string().transform(removeExtraWhiteSpaces),
  timingTo: z.string().transform(removeExtraWhiteSpaces),
});

export const ApplyJob = z.object({
  query: z.object({
    employeeId: z.string().regex(/\d+/).transform(Number),
    jobId: z.string().regex(/\d+/).transform(Number),
  }),
});

export const JobIdQ = z.object({
  query: z.object({
    jobId: z.string().regex(/\d+/).transform(Number),
  }),
});