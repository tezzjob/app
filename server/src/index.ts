import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import httpStatus from "http-status";
import routes from "./routes/index.routes";
import { ApiError, errorConverter, errorHandler } from "./middlewares/errors";

const app = express();

// Use CORS
app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "50mb" }));

app.use("/heath-check", (_req, res) => {
  res.send("Status: Healthy");
});

app.use("/error", async () => {
  throw new Error();
});

app.use("/api", routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  logger.error("Not found");
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);

app.use(errorHandler);

const PORT = 8080

app.listen(PORT, (): void => console.log(`Server is running on ${PORT}`));

// import app from "./app";
// import { APP_PORT } from "./utils/config";
// import logger from "./utils/logger";

// const init = async () => {
//   logger.info("starting server..");

//   app.listen(APP_PORT, () => {
//     logger.info(`server listening on ${APP_PORT}`);
//   });
// };

// init();

// process.on("uncaughtException", (err) => {
//   logger.error("Uncaught Exception: " + err);
//   logger.error(err.stack);
// });