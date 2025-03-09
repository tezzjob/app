import express from "express";
import cors from "cors";
import logger from "../src/utils/logger";
import httpStatus from "http-status";
import { ApiError, errorConverter, errorHandler } from "../src/middlewares/errors";
import { APP_URL } from "../src/utils/config";
import bodyParser from "body-parser";
import { sendEmail } from "../src/mailer/sendMail";
import { generateToken, auth } from "../src/middlewares/auth";
import { createEmployee, applyToJob } from "../src/service/employee.service";
import {
  registerShop,
  getShop,
  verifyShop,
  getShopDetails,
  createJobPost,
  setEmployeeAcceptStatus,
  getApplicants,
  resetPassword,
} from "../src/service/shopkeeper.service";
import {
  SignUpReq,
  RegisterShopReq,
  UuidQueryParam,
  CreateJobReq,
  ApplyJob,
  JobIdQ,
} from "../src/utils/req.zod";
import { validateType } from "../src/utils/validations";

const app = express();

// Use CORS
app.use(cors({ origin: "*" }));

app.use(
  cors({
    origin: `${APP_URL}`, // Allow requests from this origin only
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
  })
);

app.use("/", (_req, _res) => {
  _res.send("Hello World");
});

app.use(express.json({ limit: "50mb" }));

app.get("/api/heath-check", (_req, res) => {
  res.send("Status: Healthy");
});

app.use("/error", async () => {
  throw new Error();
});

app.use(bodyParser.json());

app.use("/employee/signup", async (req, res) => {
  const request = validateType(SignUpReq, req.body);
  const response = await createEmployee(request);
  res.send(response);
});

app.use("/shopkeeper/signup", async (req, res) => {
  const request = validateType(RegisterShopReq, req.body);
  const response = await registerShop(request);
  res.send(response);
});

app.use("/shopkeeper/login", async (req, res) => {
  const { ownerEmail, password } = req.body;
  if (password === undefined || ownerEmail === undefined) {
    res.status(400).json({ auth: false, token: null });
    return;
  }
  const shop = await getShop(ownerEmail);

  const passwordIsValid = (password as string) === shop.password;
  if (!passwordIsValid) {
    res.status(401).json({ auth: false, token: null });
    return;
  }

  const token = generateToken({ shopId: shop.id, ownerEmail: shop.ownerEmail });
  res.status(200).json({ auth: true, token, email: shop.ownerEmail });
  return;
});

app.use("/verify", async (req, res) => {
  const request = validateType(UuidQueryParam, req);

  if (!request.query.uuid) {
    res
      .status(400)
      .json({ success: false, message: "Unable to verify account" });
  }
  let msg = "Account verified successfully!";
  let status = true;

  try {
    await verifyShop(request.query.uuid);
  } catch (error) {
    if (error instanceof ApiError) msg = error.message;
    else msg = "Verification failed";
    status = false;
  }

  res.json({ success: status, message: msg });
});

app.get("/shop-details", auth(), async (req, res) => {
  const { loggedInUser } = req;
  if (loggedInUser) {
    const details = await getShopDetails(loggedInUser);
    res.send(details);
  } else throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`);
});

app.post("/create-job", auth(), async (req, res) => {
  const { loggedInUser } = req;
  const request = validateType(CreateJobReq, req.body);
  if (loggedInUser) {
    const response = await createJobPost(loggedInUser, request);
    res.send(response);
  } else throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`);
});

app.post("/apply-to-job", async (req, res) => {
  const request = validateType(ApplyJob, req);
  const response = await applyToJob(
    request.query.employeeId,
    request.query.jobId
  );
  res.send(response);
});

app.post("/shortlist-employee", auth(), async (req, res) => {
  const request = validateType(ApplyJob, req);
  const loggedInUser = req.loggedInUser;
  if (loggedInUser) {
    const response = await setEmployeeAcceptStatus(
      loggedInUser,
      request.query.employeeId,
      request.query.jobId,
      true
    );
    res.send(response);
  } else throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`);
});

app.get("/applied-employees", auth(), async (req, res) => {
  const { loggedInUser } = req;
  const request = validateType(JobIdQ, req);
  if (loggedInUser) {
    const response = await getApplicants(loggedInUser, request.query.jobId);
    res.send(response);
  } else throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`);
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Email is required`);
  }

  const resetPasswordLink = `${APP_URL}/reset-password?userEmail=${encodeURIComponent(email)}`;
  const emailContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hey there,</p>
      <p>Click on the link below to reset your password:</p>
      <p><a href="${resetPasswordLink}" style="color: #007bff; text-decoration: none;">Reset Password</a></p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Regards,<br/>TezzJob Team</p>
    </div>
  `;

  await sendEmail(email, "Reset Password", emailContent);
  res.status(200).json({ message: "Password reset email sent successfully" });
});

app.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Email and password are required`
    );
  }
  const response = await resetPassword(email, password);
  res.send(response);
});

app.post("/logout", (req, res) => {
  res.status(200).json({ auth: false, token: null });
});

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  logger.error("Not found");
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);

app.use(errorHandler);

if(process.env.APP_ENV === 'production') {
  app.listen(8080, () => {
    logger.info('Server is running on port 8080')
  })
}

export default app;
