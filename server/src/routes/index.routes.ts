import express from 'express';
import { validateType } from '../utils/validations';
import {
  ApplyJob,
  CreateJobReq,
  JobIdQ,
  LoginShopReq,
  RegisterShopReq,
  SignUpReq,
  UuidQueryParam,
} from '../utils/req.zod';
import { applyToJob, createEmployee } from '../service/employee.service';
import {
  createJobPost,
  getApplicants,
  getShop,
  getShopDetails,
  registerShop,
  resetPassword,
  setEmployeeAcceptStatus,
  verifyShop,
} from '../service/shopkeeper.service';
import { ApiError } from '../middlewares/errors';
import bcrypt from 'bcryptjs';
import { auth, generateToken } from '../middlewares/auth';
import bodyParser from 'body-parser';
import httpStatus from 'http-status';
import { Create } from '@mui/icons-material';
import { sendEmail } from '../mailer/sendMail';

const routes = express.Router();

routes.use(bodyParser.json());

routes.post('/employee/signup', async (req, res) => {
  const request = validateType(SignUpReq, req.body);
  const response = await createEmployee(request);
  res.send(response);
});

routes.post('/shopkeeper/signup', async (req, res) => {
  const request = validateType(RegisterShopReq, req.body);
  const response = await registerShop(request);
  res.send(response);
});

routes.post(
  '/shopkeeper/login',
  async (req, res) => {
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
  }
);

routes.get('/verify', async (req, res) => {
  const request = validateType(UuidQueryParam, req);

  if (!request.query.uuid) {
    res
      .status(400)
      .json({ success: false, message: 'Unable to verify account' });
  }
  let msg = 'Account verified successfully!';
  let status = true;

  try {
    await verifyShop(request.query.uuid);
  } catch (error) {
    if (error instanceof ApiError) msg = error.message;
    else msg = 'Verification failed';
    status = false;
  }

  res.json({ success: status, message: msg });
});

routes.get('/shop-details', auth(), async (req, res) => {
  const { loggedInUser } = req
  if (loggedInUser) {
    const details = await getShopDetails(loggedInUser)
    res.send(details)
  }
  else 
    throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
})

routes.post('/create-job', auth(), async (req, res) => {
  const { loggedInUser } = req
  const request = validateType(CreateJobReq, req.body);
  if (loggedInUser) {
    const response = await createJobPost(loggedInUser, request)
    res.send(response)
  }
  else
    throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
})

routes.post('/apply-to-job', async (req, res) => {
  const request = validateType(ApplyJob, req);
  const response = await applyToJob(request.query.employeeId, request.query.jobId)
  res.send(response);
})

routes.post('/shortlist-employee', auth(),async (req, res) => {
  const request = validateType(ApplyJob, req);
  const loggedInUser = req.loggedInUser;
  if (loggedInUser) {
    const response = await setEmployeeAcceptStatus(loggedInUser, request.query.employeeId, request.query.jobId, true)
      res.send(response);
  } else 
    throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
})

routes.get('/applied-employees', auth(), async (req, res) => {
  const { loggedInUser } = req
  const request = validateType(JobIdQ, req);
  if (loggedInUser) {
    const response = await getApplicants(loggedInUser, request.query.jobId)
    res.send(response)
  }
  else
    throw new ApiError(httpStatus.BAD_REQUEST, `Access Denied`)
})


routes.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Email is required`)
  }

  const resetPasswordLink = `http://localhost:3000/reset-password?userEmail=${encodeURIComponent(email)}`;
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
});

routes.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Email and password are required`)
  }
  const response = await resetPassword(email, password);
  res.send(response);
});

routes.post('/logout', (req, res) => {
  res.status(200).json({ auth: false, token: null });
});

export default routes;