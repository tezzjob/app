
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
app.use("/", auth(), async (req, res, next) => {
  try {
    const { path, method } = req.query;

    if (path === "health-check") {
      res.send("Status: Healthy");
    } else if (path === "employee/signup" && method === "POST") {
      const encodedPayload = req.query.payload;
      const decodedPayload = JSON.parse(
        Buffer.from(encodedPayload as string, "base64").toString("utf-8")
      );
      const request = validateType(SignUpReq, JSON.parse(decodedPayload));
      const response = await createEmployee(request);
      res.send(response);
    } else if (path === "shopkeeper/signup" && method === "POST") {
      const request = validateType(RegisterShopReq, req.body);
      const response = await registerShop(request);
      res.send(response);
    } else if (path === "shopkeeper/login" && method === "POST") {
      const { ownerEmail, password } = req.body;
      if(password === undefined || ownerEmail === undefined) {
        res.status(400).json({ auth: false, token: null });
        return
      }
      const shop = await getShop(ownerEmail);
      
      const passwordIsValid = (password as string) === shop.password;
      if (!passwordIsValid) {
        res.status(401).json({ auth: false, token: null });
        return
      }
  
      const token = generateToken({ shopId: shop.id, ownerEmail: shop.ownerEmail });
      res.status(200).json({ auth: true, token, email: shop.ownerEmail });
      return
    } else if (path === "verify") {
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
    } else if (path === "forgot-password" && method === "POST") {
      const { email } = req.body;
        if (!email) {
          throw new ApiError(httpStatus.BAD_REQUEST, `Email is required`)
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
      
        await sendEmail(email, 'Reset Password', emailContent);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } else if (path === "reset-password" && method === "POST") {
      const { email, password } = req.body;
        if (!email || !password) {
          throw new ApiError(httpStatus.BAD_REQUEST, `Email and password are required`)
        }
        const response = await resetPassword(email, password);
        res.send(response);
    } else if (path === "logout" && method === "POST") {
      res.status(200).json({ auth: false, token: null });
    } else if (path === "apply-to-job" && method === "POST") {
      const request = validateType(ApplyJob, req);
      const response = await applyToJob(
        request.query.employeeId,
        request.query.jobId
      );
      res.send(response);
    } else if (path === "shop-details" && method === "GET") {
      const { loggedInUser } = req
        if (loggedInUser) {
          const details = await getShopDetails(loggedInUser)
          res.send(details)
        }
        else 
          throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
    } else if (path === "create-job" && method === "POST") {
      const { loggedInUser } = req
        const request = validateType(CreateJobReq, req.body);
        if (loggedInUser) {
          const response = await createJobPost(loggedInUser, request)
          res.send(response)
        }
        else
          throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
    } else if (path === "shortlist-employee" && method === "POST") {
      const request = validateType(ApplyJob, req);
        const loggedInUser = req.loggedInUser;
        if (loggedInUser) {
          const response = await setEmployeeAcceptStatus(loggedInUser, request.query.employeeId, request.query.jobId, true)
            res.send(response);
        } else 
          throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
    } else if (path === "applied-employees" && method === "GET") {
      const { loggedInUser } = req
        const request = validateType(JobIdQ, req);
        if (loggedInUser) {
          const response = await getApplicants(loggedInUser, request.query.jobId)
          res.send(response)
        }
        else
          throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
    } else {
      next(new ApiError(httpStatus.NOT_FOUND, 'Not found'))
    }
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorConverter);
app.use(errorHandler);

export default (req: VercelRequest, res: VercelResponse) => app(req, res);
