import app from "./app";
import { APP_PORT } from "./utils/config";
import logger from "./utils/logger";

const init = async () => {
  logger.info("starting server..");

  app.listen(APP_PORT, () => {
    logger.info(`server listening on ${APP_PORT}`);
  });
};

init();

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception: " + err);
  logger.error(err.stack);
});