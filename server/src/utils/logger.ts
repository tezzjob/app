import winston from "winston";
import { IS_PRODUCTION } from "./config";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const format = winston.format.combine(
  enumerateErrorFormat(),
  winston.format.colorize(),
  winston.format.splat(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ level, message, timestamp }) => `${level}:[${timestamp}]: ${message}`
  )
);

const transportConsole = new winston.transports.Console({
  level: "info",
  stderrLevels: ["error"],
});

const logger = winston.createLogger({
  level: IS_PRODUCTION ? "info" : "debug",
  format,
  //reference: https://github.com/winstonjs/winston-daily-rotate-file
  transports: transportConsole,
});

export const communicationLogger = winston.createLogger({
  level: IS_PRODUCTION ? "info" : "debug",
  format,
  transports: transportConsole
});

export default logger;