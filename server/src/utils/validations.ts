import httpStatus from "http-status";
import {ApiError} from "../middlewares/errors";
import { z } from "zod";
import { ErrorConstant } from "./constants";

export const removeExtraWhiteSpaces = (input: string | null | undefined) => {
  if (!input)
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      ErrorConstant.NULL_STRING
    );
  return input.replace(/\s+/g, " ").trim();
};

export function validateType<T extends z.ZodType<any>>(
  schema: T,
  req
): z.infer<T> {
  try {
    return schema.parse(req) as z.infer<T>;
  } catch (err) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid Request Body",
      true,
      err
    );
  }
}
