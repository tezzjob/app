import express from "express";
import { validateType } from "../src/utils/validations";
import {
  ApplyJob,
  CreateJobReq,
  JobIdQ,
  LoginShopReq,
  RegisterShopReq,
  SignUpReq,
  UuidQueryParam,
} from "../src/utils/req.zod";
import { applyToJob, createEmployee } from "../src/service/employee.service";
import {
  createJobPost,
  getApplicants,
  getShop,
  getShopDetails,
  registerShop,
  resetPassword,
  setEmployeeAcceptStatus,
  verifyShop,
} from "../src/service/shopkeeper.service";
import { ApiError } from "../src/middlewares/errors";
import bcrypt from "bcryptjs";
import { auth, generateToken } from "../src/middlewares/auth";
import bodyParser from "body-parser";
import httpStatus from "http-status";
import { sendEmail } from "../src/mailer/sendMail";
import { APP_URL } from "../src/utils/config";
import serverlessExpress from "@codegenie/serverless-express";

const app = express();
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));

app.get('/', async (req, res) => {
    res.send({message: "Hello World"})
})
// Define routes
app.post("/employee/signup", async (req, res) => {
  const request = validateType(SignUpReq, req.body);
  const response = await createEmployee(request);
  res.send(response);
});

app.post("/shopkeeper/signup", async (req, res) => {
  const request = validateType(RegisterShopReq, req.body);
  const response = await registerShop(request);
  res.send(response);
});

app.post("/shopkeeper/login", async (req, res) => {
  const { ownerEmail, password } = req.body;
  if (!password || !ownerEmail) {
    res.status(400).json({ auth: false, token: null });
  }
  const shop = await getShop(ownerEmail);
  const passwordIsValid = password === shop.password;
  if (!passwordIsValid) {
     res.status(401).json({ auth: false, token: null });
  }
  const token = generateToken({ shopId: shop.id, ownerEmail: shop.ownerEmail });
  res.status(200).json({ auth: true, token, email: shop.ownerEmail });
});

app.get("/verify", async (req, res) => {
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
    msg = error instanceof ApiError ? error.message : "Verification failed";
    status = false;
  }
  res.json({ success: status, message: msg });
});

// More routes (converted from Express)
app.get("/shop-details", auth(), async (req, res) => {
  if (req.loggedInUser) {
    const details = await getShopDetails(req.loggedInUser);
    res.send(details);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Access Denied");
  }
});

app.post("/create-job", auth(), async (req, res) => {
  const request = validateType(CreateJobReq, req.body);
  if (req.loggedInUser) {
    const response = await createJobPost(req.loggedInUser, request);
    res.send(response);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Access Denied");
  }
});

app.post("/apply-to-job", async (req, res) => {
  const request = validateType(ApplyJob, req);
  const response = await applyToJob(
    request.query.employeeId,
    request.query.jobId
  );
  res.send(response);
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email is required");
  }
  const resetPasswordLink = `${APP_URL}/reset-password?userEmail=${encodeURIComponent(email)}`;
  const emailContent = `Click <a href="${resetPasswordLink}">here</a> to reset your password.`;
  await sendEmail(email, "Reset Password", emailContent);
  res.status(200).json({ message: "Password reset email sent successfully" });
});

app.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email and password are required"
    );
  }
  const response = await resetPassword(email, password);
  res.send(response);
});

// Convert Express app to serverless function
const server = serverlessExpress({ app });
export const handler = async (event: any, context: any) => server(event, context);