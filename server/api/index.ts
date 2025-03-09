
import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import cors from "cors";
import logger from "../src/utils/logger";
import httpStatus from "http-status";
import { ApiError, errorConverter, errorHandler } from "../src/middlewares/errors";
import { APP_URL } from "../src/utils/config";
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

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));

// Main route handler
app.all("/", async (req, res, next) => {
  try {
    const { path, method } = req.query;

    if (path === "health-check") {
      res.send("Status: Healthy");
    } else if (path === "employee/signup" && method === "POST") {
      const request = validateType(SignUpReq, req.body);
      res.send(await createEmployee(request));
    } else if (path === "shopkeeper/signup" && method === "POST") {
      const request = validateType(RegisterShopReq, req.body);
      res.send(await registerShop(request));
    } else if (path === "shopkeeper/login" && method === "POST") {
      const { ownerEmail, password } = req.body;
      if (!password || !ownerEmail)
        throw new ApiError(400, "Missing credentials");

      const shop = await getShop(ownerEmail);
      if (shop.password !== password)
        throw new ApiError(401, "Invalid credentials");

      const token = generateToken({ shopId: shop.id, ownerEmail });
      res.json({ auth: true, token, email: ownerEmail });
    } else if (path === "verify") {
      const request = validateType(UuidQueryParam, req);
      await verifyShop(request.query.uuid);
      res.json({ success: true, message: "Account verified successfully!" });
    } else if (path === "forgot-password" && method === "POST") {
      const { email } = req.body;
      if (!email) throw new ApiError(400, "Email required");

      const link = `${APP_URL}/reset-password?userEmail=${encodeURIComponent(email)}`;
      await sendEmail(
        email,
        "Reset Password",
        `<a href="${link}">Reset Password</a>`
      );
      res.json({ message: "Password reset email sent successfully" });
    } else {
      throw new ApiError(404, "Route not found");
    }
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorConverter);
app.use(errorHandler);

export default (req: VercelRequest, res: VercelResponse) => app(req, res);
