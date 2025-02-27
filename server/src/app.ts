import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import httpStatus from "http-status"
import routes from './routes/index.routes'
import {ApiError, errorConverter, errorHandler } from './middlewares/errors'

const app = express()

// Use CORS
app.use(cors());

// Optionally configure specific origins
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin only
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
  })
);

app.use(express.json({ limit: "50mb" }));

app.use('/heath-check', (_req, res) => {
    res.send('Status: Healthy')
})

app.use("/error", async () => {
  throw new Error();
})

app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  logger.error('Not found')
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(errorConverter);

app.use(errorHandler);

export default app