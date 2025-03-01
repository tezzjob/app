import app from "../src/app";
import { VercelRequest, VercelResponse } from "@vercel/node";
import logger from "../src/utils/logger";

logger.info("Starting server..");

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: " + err);
  logger.error(err.stack);
});
