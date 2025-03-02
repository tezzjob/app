import express from 'express'
import cors from 'cors'
import logger from './utils/logger'
import httpStatus from "http-status"
import routes from './routes/index.routes'
import {ApiError, errorConverter, errorHandler } from './middlewares/errors'

const app = express()

// Use CORS
app.use(cors({ origin: "*" }));

// Optionally configure specific origins
// app.use(
//   cors({
//     origin: `${APP_URL}`, // Allow requests from this origin only
//     methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
//     allowedHeaders: 'Content-Type,Authorization', // Allowed headers
//   })
// );

app.use(express.json({ limit: "50mb" }));

app.use('/heath-check', (_req, res) => {
    res.send('Status: Healthy')
})

app.use("/error", async () => {
  throw new Error();
})

// app.use('/', routes);

app.get('/', async (req, res) => {
  res.send({message: "Hello World"})
})

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  logger.error('Not found')
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
})

app.use(errorConverter);

app.use(errorHandler);

// if(process.env.APP_ENV === 'production') {
//   app.listen(8080, () => {
//     logger.info('Server is running on port 8080')
//   })
// }

export default app