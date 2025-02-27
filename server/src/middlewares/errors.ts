import { NextFunction, Request, Response } from "express";
import "express-async-errors";
import httpStatus from "http-status";
import { IS_PRODUCTION } from "../utils/config";
import logger from "../utils/logger";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorConverter = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  if (error instanceof PrismaClientValidationError) {
    const statusCode = httpStatus.BAD_REQUEST;
    error = new ApiError(
      httpStatus.BAD_REQUEST,
      httpStatus[statusCode] as string,
      true,
      err.stack
    );
  } else if (!(err.statusCode && err.message)) {
    const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    const message = httpStatus[statusCode];
    error = new ApiError(statusCode, message as string, true, err.stack);
  }
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
let { statusCode, message } = err;
  
  if (IS_PRODUCTION && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR].toString();
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(!IS_PRODUCTION && {stack: err.stack})
  };

  logger.error(err);

  res.status(statusCode).send(response);
};


